import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sanitizeEmail } from "@/lib/sanitizer";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from "@/lib/security";
import { handleError } from "@/lib/errorHandler";
import { createRequestLogger } from "@/lib/logger";

/**
 * Send OTP route: generates OTP and returns it for EmailJS to send
 * Client-side will handle EmailJS email sending
 */
export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || `send-otp-${Date.now()}`;
  const requestLogger = createRequestLogger(requestId);

  try {
    const body = await req.json();
    const { email: rawEmail } = body;

    if (!rawEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const email = sanitizeEmail(rawEmail);

    requestLogger.info("OTP request", {
      email: email.substring(0, 3) + "***",
    });

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      requestLogger.warn("OTP request for non-existent user", {
        email: email.substring(0, 3) + "***",
      });
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    requestLogger.info("OTP generated", {
      email: email.substring(0, 3) + "***",
    });

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    
    // Return OTP to client for EmailJS sending
    return NextResponse.json(
      {
        success: true,
        message: "OTP generated successfully",
        otp, // Client will use this to send via EmailJS
        email,
        userName: user.name || "User",
      },
      { status: 200, headers }
    );
  } catch (error) {
    requestLogger.error("Error sending OTP", {
      error: error instanceof Error ? error.message : String(error),
    });

    return handleError(error, "POST /api/auth/send-otp");
  }
}
