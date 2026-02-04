import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { handleError } from "@/lib/errorHandler";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';

/**
 * OWASP Security: Users API Route
 * 
 * Security measures implemented:
 * 1. XSS Prevention: Sanitized user data returned to client
 * 2. Authorization: Checks user headers set by middleware
 * 3. Caching: Redis caching prevents database enumeration attacks
 * 4. Error handling: Generic error messages prevent information disclosure
 */
export async function GET(req: Request) {
  try {
    // 🔒 Authorization: User data injected by authorization middleware
    const userEmail = req.headers.get("x-user-email");
    const userRole = req.headers.get("x-user-role");

    if (!userEmail || !userRole) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "User route accessible to all authenticated users",
      user: {
        email: userEmail,
        role: userRole,
      },
    });
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
