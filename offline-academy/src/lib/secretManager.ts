/**
 * 🔐 Secret Manager Service
 * 
 * Purpose: Server-side service to securely retrieve secrets from database
 * - Simulates cloud secret managers (AWS Secrets Manager, Azure Key Vault)
 * - Secrets are stored encrypted and decrypted only at runtime
 * - Follows least-privilege: only server code can access secrets
 * 
 * Security Principles:
 * - ✅ Secrets retrieved only at runtime (never hardcoded)
 * - ✅ All secrets encrypted at rest in database
 * - ✅ Decryption happens only in memory, never logged
 * - ✅ Service throws errors if secrets are missing (fail-secure)
 * - ✅ Environment-specific secrets (dev/prod isolation)
 */

import { prisma } from './db/prisma';
import { decrypt } from '@/utils/crypto';

/**
 * Retrieve and decrypt a secret by key
 * 
 * @param key - Secret identifier (e.g., "DATABASE_URL", "JWT_SECRET")
 * @param environment - Target environment (defaults to NODE_ENV)
 * @returns Decrypted secret value
 * 
 * ⚠️ CRITICAL SECURITY NOTES:
 * - This function MUST only be called server-side
 * - NEVER expose return value to client-side code
 * - NEVER log the return value
 * - Always use in API routes, server actions, or server components
 * 
 * Example usage:
 * ```typescript
 * const dbUrl = await getSecret('DATABASE_URL');
 * // Use dbUrl to connect to database
 * // Never log dbUrl or send it to client
 * ```
 */
export async function getSecret(
  key: string,
  environment: string = process.env.NODE_ENV || 'production'
): Promise<string> {
  try {
    // Fetch encrypted secret from database
    const secret = await prisma.secret.findFirst({
      where: {
        key,
        environment,
      },
    });

    // Fail-secure: throw error if secret doesn't exist
    if (!secret) {
      // ✅ Safe to log key name (not the value)
      console.error(`Secret not found: key="${key}", env="${environment}"`);
      throw new Error(`Secret "${key}" not found for environment "${environment}"`);
    }

    // Decrypt the secret value
    const decryptedValue = decrypt(secret.value);

    // ✅ Safe to log that we retrieved a secret (not the value)
    console.log(`✓ Secret retrieved: key="${key}"`);

    return decryptedValue;
  } catch (error) {
    // Re-throw with safe error message (no secret exposure)
    if (error instanceof Error && error.message.includes('not found')) {
      throw error;
    }
    throw new Error(`Failed to retrieve secret "${key}"`);
  }
}

/**
 * Store or update an encrypted secret
 * 
 * @param key - Secret identifier
 * @param value - Plaintext secret value (will be encrypted)
 * @param environment - Target environment
 * 
 * ⚠️ SECURITY: This function should only be used in:
 * - Initial setup scripts
 * - Secret rotation scripts
 * - Admin APIs with strict authentication
 * 
 * NOT for regular application runtime!
 */
export async function setSecret(
  key: string,
  value: string,
  environment: string = process.env.NODE_ENV || 'production'
): Promise<void> {
  const { encrypt } = await import('@/utils/crypto');

  try {
    const encryptedValue = encrypt(value);

    await prisma.secret.upsert({
      where: {
        key_environment: {
          key,
          environment,
        },
      },
      update: {
        value: encryptedValue,
        rotatedAt: new Date(), // Track rotation for compliance
      },
      create: {
        key,
        value: encryptedValue,
        environment,
        rotatedAt: new Date(),
      },
    });

    console.log(`✓ Secret stored: key="${key}", env="${environment}"`);
  } catch (error) {
    throw new Error(`Failed to store secret "${key}"`);
  }
}

/**
 * List all secret keys (without values) for audit purposes
 * 
 * @param environment - Filter by environment
 * @returns Array of secret metadata (no decrypted values)
 */
export async function listSecrets(environment?: string) {
  const secrets = await prisma.secret.findMany({
    where: environment ? { environment } : undefined,
    select: {
      key: true,
      environment: true,
      rotatedAt: true,
      createdAt: true,
      // ⚠️ Never include 'value' field in queries (even encrypted)
    },
    orderBy: {
      key: 'asc',
    },
  });

  return secrets;
}

/**
 * Delete a secret (for cleanup or rotation)
 * 
 * @param key - Secret identifier to delete
 * @param environment - Target environment
 */
export async function deleteSecret(
  key: string,
  environment: string = process.env.NODE_ENV ?? 'production'
): Promise<void> {
  await prisma.secret.delete({
    where: {
      key_environment: {
        key,
        environment,
      },
    },
  });

  console.log(`✓ Secret deleted: key="${key}", env="${environment}"`);
}
