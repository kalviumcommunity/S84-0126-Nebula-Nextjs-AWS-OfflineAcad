import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Generate or extract correlation ID for request tracing
  const requestId = req.headers.get('x-request-id') || generateRequestId();

  try {
    const requestLogger = logger;
    requestLogger.setRequestId(requestId);

    // Log incoming request
    requestLogger.info('Incoming request', {
      requestId,
      method: req.method,
      path: pathname,
      userAgent: req.headers.get('user-agent')?.substring(0, 50),
    });
  } catch (error) {
    // Fallback to console if logger fails
    console.log(`[INFO] Incoming request: ${req.method} ${pathname}`);
  }

  // Enforce HTTPS in production (redirect non-HTTPS requests)
  if (process.env.NODE_ENV === 'production') {
    const proto = req.headers.get('x-forwarded-proto') || '';
    if (proto !== 'https') {
      try {
        logger.warn('HTTPS redirect required', {
          requestId,
          path: pathname,
          currentProto: proto,
        });
      } catch (error) {
        console.warn(`[WARN] HTTPS redirect required for ${pathname}`);
      }

      const url = new URL(req.nextUrl.toString());
      url.protocol = 'https:';
      return NextResponse.redirect(url);
    }
  }

  // ✅ Ignore preflight requests
  if (req.method === "OPTIONS") {
    return NextResponse.next();
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
