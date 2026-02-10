import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyOTP } from "@/lib/otp";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { sanitizeEmail } from "@/lib/sanitizer";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from "@/lib/security";
import { handleError } from "@/lib/errorHandler";
import { createRequestLogger } from "@/lib/logger";

/**
 * Verify OTP route: validates OTP and logs user in
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = req.headers.get("x-request-id") || `verify-otp-${Date.now()}`;
  const requestLogger = createRequestLogger(requestId);

  try {
    const body = await req.json();
    const { email: rawEmail, otp } = body;

    if (!rawEmail || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const email = sanitizeEmail(rawEmail);

    requestLogger.info("OTP verification attempt", {
      email: email.substring(0, 3) + "***",
    });

    // Verify OTP
    const otpResult = verifyOTP(email, otp);
    if (!otpResult.success) {
      requestLogger.warn("OTP verification failed", {
        email: email.substring(0, 3) + "***",
        reason: otpResult.message,
      });
      
      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: otpResult.message },
        { status: 401, headers }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      requestLogger.warn("OTP verified but user not found", {
        email: email.substring(0, 3) + "***",
      });
      
      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404, headers }
      );
    }

    // Generate tokens
    const accessToken = await createAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken({ userId: user.id, role: user.role });

    // Set refresh token in cookie
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    const duration = Date.now() - startTime;
    requestLogger.info("OTP login successful", {
      userId: user.id,
      role: user.role,
      duration_ms: duration,
    });

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json(
      {
        success: true,
        accessToken,
        user: { id: user.id, email: user.email, role: user.role, name: user.name },
        requestId,
      },
      { status: 200, headers }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    requestLogger.error("OTP verification error", {
      duration_ms: duration,
      error: error instanceof Error ? error.message : String(error),
    });

    return handleError(error, "POST /api/auth/verify-otp");
  }
}
