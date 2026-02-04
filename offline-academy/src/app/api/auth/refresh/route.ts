import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, createAccessToken } from "@/lib/jwt";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401, headers });
  }

  // 1. Verify Refresh Token
  const payload: any = await verifyToken(refreshToken);
  if (!payload) {
    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json({ success: false, message: "Invalid refresh token" }, { status: 401, headers });
  }

  // 2. Issue New Access Token
  // We need to keep the role in the access token
  const newAccessToken = await createAccessToken({ userId: payload.userId, role: payload.role });

  const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
  return NextResponse.json({
    success: true,
    accessToken: newAccessToken,
  }, { status: 200, headers });
}
