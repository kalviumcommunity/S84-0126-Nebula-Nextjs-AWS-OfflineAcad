import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/schemas";
import { prisma } from "@/lib/db/prisma";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { sanitizeEmail } from "@/lib/sanitizer";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';
import { handleError } from "@/lib/errorHandler";
import { createRequestLogger } from "@/lib/logger";

/**
 * Login route: validates input, verifies password, issues tokens
 * Logs all authentication attempts and failures for security monitoring
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = req.headers.get('x-request-id') || `login-${Date.now()}`;
  const requestLogger = createRequestLogger(requestId);

  try {
    const body = await req.json();
    const { email: rawEmail, password } = loginSchema.parse(body);

    const email = sanitizeEmail(rawEmail);

    requestLogger.info('Login attempt', {
      email: email.substring(0, 3) + '***', // Partial email for security
      endpoint: '/api/auth/login',
      method: 'POST',
    });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const duration = Date.now() - startTime;
      requestLogger.warn('Login failed - user not found', {
        email: email.substring(0, 3) + '***',
        duration_ms: duration,
        reason: 'user_not_found',
      });

      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: "User not found", requestId }, 
        { status: 401, headers }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const duration = Date.now() - startTime;
      requestLogger.warn('Login failed - invalid credentials', {
        userId: user.id,
        duration_ms: duration,
        reason: 'invalid_credentials',
      });

      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: "Invalid credentials", requestId }, 
        { status: 401, headers }
      );
    }

    const accessToken = await createAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken({ userId: user.id, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    const duration = Date.now() - startTime;
    requestLogger.info('Login successful', {
      userId: user.id,
      role: user.role,
      duration_ms: duration,
    });

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json(
      { 
        success: true, 
        accessToken, 
        user: { id: user.id, email: user.email, role: user.role },
        requestId,
      }, 
      { status: 200, headers }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    requestLogger.error('Login error', {
      duration_ms: duration,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    return handleError(error, "POST /api/auth/login");
  }
}
