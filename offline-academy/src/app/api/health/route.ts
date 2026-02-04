import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCorsHeaders, getSecurityHeaders, mergeHeaders } from '@/lib/security';
import { logger, createRequestLogger } from '@/lib/logger';

/**
 * Health Check Endpoint
 * Verifies application and database connectivity
 * Logs all requests and responses with correlation IDs
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = request.headers.get('x-request-id') || `health-${Date.now()}`;
  const requestLogger = createRequestLogger(requestId);

  try {
    // Log incoming request
    requestLogger.info('Health check request received', {
      endpoint: '/api/health',
      method: 'GET',
      userAgent: request.headers.get('user-agent'),
    });

    // Check database connectivity
    const dbCheckStart = Date.now();
    const result = await prisma.$queryRaw`SELECT 1`;
    const dbDuration = Date.now() - dbCheckStart;

    // Log successful database check
    requestLogger.debug('Database connectivity verified', {
      duration_ms: dbDuration,
    });

    const duration = Date.now() - startTime;
    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());

    // Log successful response
    requestLogger.info('Health check completed successfully', {
      status: 200,
      duration_ms: duration,
      db_duration_ms: dbDuration,
    });

    return NextResponse.json(
      { 
        status: "ok", 
        db: result,
        requestId,
        timestamp: new Date().toISOString(),
      }, 
      { status: 200, headers }
    );
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error with full details
    requestLogger.error('Health check failed', {
      status: 500,
      duration_ms: duration,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    });

    const headers = mergeHeaders(getSecurityHeaders(), getCorsHeaders());
    return NextResponse.json(
      { 
        status: "error", 
        message: "Health check failed",
        requestId,
        timestamp: new Date().toISOString(),
      }, 
      { status: 500, headers }
    );
  }
}
