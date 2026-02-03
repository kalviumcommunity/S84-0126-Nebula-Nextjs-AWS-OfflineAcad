import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { logger } from "@/lib/logger";


/**
 * Generate a unique correlation ID for request tracing
 * Format: uuid-timestamp-random
 */
function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req-${timestamp}-${random}`;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Generate or extract correlation ID for request tracing
  const requestId = req.headers.get("x-request-id") || generateRequestId();
  const requestLogger = logger;
  requestLogger.setRequestId(requestId);

  // Log incoming request
  requestLogger.info("Incoming request", {
    requestId,
    method: req.method,
    path: pathname,
    userAgent: req.headers.get("user-agent")?.substring(0, 50),
  });

  // Enforce HTTPS in production (redirect non-HTTPS requests)
  if (process.env.NODE_ENV === "production") {
    const proto = req.headers.get("x-forwarded-proto") || "";
    if (proto !== "https") {
      requestLogger.warn("HTTPS redirect required", {
        requestId,
        path: pathname,
        currentProto: proto,
      });

      const url = new URL(req.nextUrl.toString());
      url.protocol = "https:";
      return NextResponse.redirect(url);
    }
  }

  // ✅ Ignore preflight requests
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  // ✅ Public Routes (No Auth Needed)
  const publicRoutes = ["/api/auth/login", "/api/auth/signup", "/api/health"];
  if (publicRoutes.includes(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-request-id", requestId);
    return response;
  }

  /**
   * 🔐 PROTECTED API ROUTES
   */
  if (pathname.startsWith("/api/")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      requestLogger.warn("Access denied - token missing", { requestId, path: pathname });
      return NextResponse.json(
        { success: false, message: "Authentication required", requestId },
        { status: 401, headers: { "x-request-id": requestId } }
      );
    }

    try {
      const decoded = (await verifyToken(token)) as {
        userId: string;
        email: string;
        role: "STUDENT" | "TEACHER" | "ADMIN";
      } | null;

      if (!decoded) throw new Error("Invalid token");

      // Admin check for admin routes
      if (pathname.startsWith("/api/admin") && decoded.role !== "ADMIN") {
        requestLogger.warn("Admin access denied", { requestId, userId: decoded.userId, path: pathname });
        return NextResponse.json(
          { success: false, message: "Admin privileges required", requestId },
          { status: 403, headers: { "x-request-id": requestId } }
        );
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);
      requestHeaders.set("x-request-id", requestId);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      requestLogger.warn("Access denied - invalid token", { requestId, path: pathname });
      return NextResponse.json(
        { success: false, message: "Invalid session", requestId },
        { status: 403, headers: { "x-request-id": requestId } }
      );
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
