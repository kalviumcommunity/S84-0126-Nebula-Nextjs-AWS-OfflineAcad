const DEFAULT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function getCsp() {
  return [
    "default-src 'self'",
    "script-src 'self' https://apis.google.com 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
  ].join('; ');
}

export function getSecurityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': getCsp(),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=()',
  } as Record<string, string>;
}

export function getCorsHeaders(origin?: string) {
  const allowOrigin = origin || DEFAULT_APP_URL;
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  } as Record<string, string>;
}

export function mergeHeaders(...sources: Array<Record<string, string> | undefined>) {
  return Object.assign({}, ...sources);
}

export default { getSecurityHeaders, getCorsHeaders, getCsp, mergeHeaders };
