import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/prisma";
import { handleError } from "@/lib/errorHandler";
import { sanitizeEmail, sanitizeText } from "@/lib/sanitizer";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';
import { createRequestLogger } from "@/lib/logger";

/**
 * OWASP Security: Signup API Route
 * 
 * Security measures implemented:
 * 1. XSS Prevention: User input sanitized before storage
 * 2. SQL Injection Prevention: Using Prisma ORM parameterized queries
 * 3. Input validation: Email and password requirements checked
 * 4. Password security: Bcrypt hashing with salt rounds
 * 5. Audit Logging: All signup attempts and outcomes are logged
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = req.headers.get('x-request-id') || `signup-${Date.now()}`;
  const requestLogger = createRequestLogger(requestId);

  try {
    const { email: rawEmail, password, name: rawName } = await req.json();

    requestLogger.debug('Signup attempt received', {
      endpoint: '/api/auth/signup',
      method: 'POST',
    });

    if (!rawEmail || !password) {
      const duration = Date.now() - startTime;
      requestLogger.warn('Signup validation failed - missing required fields', {
        duration_ms: duration,
        reason: 'missing_fields',
      });

      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: "Email and password are required", requestId },
        { status: 400, headers }
      );
    }

    // 🔒 XSS Prevention: Sanitize user input before storing
    // Removes any HTML tags or JavaScript injection attempts
    const email = sanitizeEmail(rawEmail);
    const name = sanitizeText(rawName || "");

    // Validate sanitized email is not empty after cleaning
    if (!email) {
      const duration = Date.now() - startTime;
      requestLogger.warn('Signup validation failed - invalid email format', {
        duration_ms: duration,
        reason: 'invalid_email',
      });

      return NextResponse.json(
        { success: false, message: "Invalid email format", requestId },
        { status: 400 }
      );
    }

    // 🔒 SQL Injection Prevention: Prisma ORM uses parameterized queries
    // User input treated as DATA, never as SQL code
    // Even malicious input like "' OR '1'='1" is treated as literal string
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const duration = Date.now() - startTime;
      requestLogger.warn('Signup failed - user already exists', {
        email: email.substring(0, 3) + '***',
        duration_ms: duration,
        reason: 'user_exists',
      });

      const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
      return NextResponse.json(
        { success: false, message: "User already exists", requestId },
        { status: 409, headers }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const duration = Date.now() - startTime;
    requestLogger.info('User signup successful', {
      userId: user.id,
      email: email.substring(0, 3) + '***',
      role: user.role,
      duration_ms: duration,
    });

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json(
      {
        success: true,
        message: "Signup successful",
        user,
        requestId,
      },
      { status: 201, headers }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Log the error before handling
    const logger = createRequestLogger(requestId);
    logger.error('Signup error', {
      duration_ms: duration,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    return handleError(error, "POST /api/auth/signup");
  }
}
