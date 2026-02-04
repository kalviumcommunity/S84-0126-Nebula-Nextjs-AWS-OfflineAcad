import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { logger } from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Generate a unique correlation ID for request tracing
 * Format: uuid-timestamp-random
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req-${timestamp}-${random}`;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Generate or extract correlation ID for request tracing
  const requestId = req.headers.get('x-request-id') || generateRequestId();
  const requestLogger = logger;
  requestLogger.setRequestId(requestId);

  // Log incoming request
  requestLogger.info('Incoming request', {
    requestId,
    method: req.method,
    path: pathname,
    userAgent: req.headers.get('user-agent')?.substring(0, 50),
  });

  // Enforce HTTPS in production (redirect non-HTTPS requests)
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers.get('x-forwarded-proto') || '';
    if (proto !== 'https') {
      requestLogger.warn('HTTPS redirect required', {
        requestId,
        path: pathname,
        currentProto: proto,
      });

      const url = new URL(req.nextUrl.toString());
      url.protocol = 'https:';
      return NextResponse.redirect(url);
    }
  }

  // ✅ Ignore preflight requests
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  /**
   * 🔓 PUBLIC ROUTES (no auth)
   * - Used for Redis caching assignment
   */
  if (pathname.startsWith("/api/users")) {
    const response = NextResponse.next();
    // Add request ID to response headers for client tracking
    response.headers.set('x-request-id', requestId);
    return response;
  }

  /**
   * 🔐 PROTECTED ADMIN ROUTES
   */
  if (pathname.startsWith("/api/admin")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      requestLogger.warn('Admin access denied - token missing', {
        requestId,
        path: pathname,
      });

      return NextResponse.json(
        { success: false, message: "Token missing", requestId },
        { status: 401, headers: { 'x-request-id': requestId } }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: "STUDENT" | "TEACHER" | "ADMIN";
      };

      if (decoded.role !== "ADMIN") {
        requestLogger.warn('Admin access denied - insufficient privileges', {
          requestId,
          userId: decoded.id,
          userRole: decoded.role,
          path: pathname,
        });

        return NextResponse.json(
          { success: false, message: "Access denied", requestId },
          { status: 403, headers: { 'x-request-id': requestId } }
        );
      }

      requestLogger.debug('Admin access granted', {
        requestId,
        userId: decoded.id,
        path: pathname,
      });

      // Attach user info
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.id);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);
      requestHeaders.set("x-request-id", requestId);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      requestLogger.warn('Admin access denied - invalid token', {
        requestId,
        path: pathname,
        error: error instanceof Error ? error.message : String(error),
      });

      return NextResponse.json(
        { success: false, message: "Invalid or expired token", requestId },
        { status: 403, headers: { 'x-request-id': requestId } }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
}

/**
 * ✅ Run middleware only for API routes
 */
export const config = {
  matcher: ["/api/:path*"],
};
