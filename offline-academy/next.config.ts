import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://apis.google.com 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https://czgonpfmuzibutsthkhv.supabase.co",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.github.com https://czgonpfmuzibutsthkhv.supabase.co",
].join('; ');

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  async headers() {
    return [
      {
        // Apply these headers to all routes in the application
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: CSP,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
