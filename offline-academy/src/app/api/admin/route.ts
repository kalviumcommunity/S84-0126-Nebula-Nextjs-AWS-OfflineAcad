import { NextResponse } from "next/server";
import { handleError } from "@/lib/errorHandler";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';

export async function GET(req: Request) {
  try {
    const email = req.headers.get("x-user-email");

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json({
      success: true,
      message: "Welcome Admin! You have full access.",
      email,
    }, { status: 200, headers });
  } catch (error) {
    return handleError(error, "GET /api/admin");
  }
}
