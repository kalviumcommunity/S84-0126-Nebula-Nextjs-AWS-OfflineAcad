/**
 * 🔐 Secrets Test API Route
 * 
 * Purpose: Demonstrate secure secret retrieval from encrypted database
 * - Fetches DATABASE_URL using secret manager
 * - Never logs or exposes actual secret values
 * - Production-safe implementation
 * 
 * Security Features:
 * ✅ Server-side only (Next.js Route Handler)
 * ✅ Secrets decrypted in memory only
 * ✅ Logs key names, never values
 * ✅ Returns success status without exposing secrets
 */

import { NextResponse } from "next/server";
import { getSecret } from "@/lib/secretManager";

export async function GET() {
  try {
    // Retrieve encrypted secret from database and decrypt it
    // This simulates fetching from AWS Secrets Manager / Azure Key Vault
    const databaseUrl = await getSecret("DATABASE_URL");
    
    // ✅ SAFE: Log only the key name we retrieved
    console.log("✓ Successfully retrieved DATABASE_URL from secret manager");
    
    // ❌ NEVER DO THIS: console.log('Database URL:', databaseUrl);
    // ❌ NEVER DO THIS: return { databaseUrl };
    
    // Use the secret for its intended purpose (e.g., database connection)
    // For this demo, we just verify it exists and has content
    const hasValue = databaseUrl && databaseUrl.length > 0;
    
    return NextResponse.json({
      success: true,
      message: "Secret retrieved successfully",
      metadata: {
        key: "DATABASE_URL",
        // ✅ SAFE: Return metadata about the secret, not the value
        hasValue,
        retrievedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Handle errors securely (don't expose secret details)
    console.error("Failed to retrieve secret:", error instanceof Error ? error.message : "Unknown error");
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve secret",
        // ✅ SAFE: Generic error message
      },
      { status: 500 }
    );
  }
}

/**
 * Example: Retrieve multiple secrets
 * 
 * In production, you might need multiple secrets:
 * - DATABASE_URL for database connection
 * - JWT_SECRET for token signing
 * - API_KEYS for external services
 */
export async function POST() {
  try {
    // Retrieve multiple secrets concurrently
    const [databaseUrl, jwtSecret] = await Promise.all([
      getSecret("DATABASE_URL"),
      getSecret("JWT_SECRET"),
    ]);
    
    // ✅ SAFE: Log that we retrieved secrets, not their values
    console.log("✓ Retrieved secrets: DATABASE_URL, JWT_SECRET");
    
    // Use secrets for application logic
    // Example: Initialize database connection, configure JWT middleware
    // const db = await connectDatabase(databaseUrl);
    // const jwtConfig = initializeJWT(jwtSecret);
    
    return NextResponse.json({
      success: true,
      message: "All secrets retrieved successfully",
      metadata: {
        secrets: ["DATABASE_URL", "JWT_SECRET"],
        retrievedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to retrieve secrets:", error instanceof Error ? error.message : "Unknown error");
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve one or more secrets",
      },
      { status: 500 }
    );
  }
}
