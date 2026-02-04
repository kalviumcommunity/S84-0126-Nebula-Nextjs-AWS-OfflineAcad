/**
 * 🔐 One-Time Secret Seeding Script
 * 
 * Purpose: Insert encrypted secrets into database
 * 
 * Usage:
 *   1. Set MASTER_KEY in .env file
 *   2. Run: npx tsx scripts/seed-secrets.ts
 *   3. Delete this file after running (for security)
 * 
 * Security Notes:
 * - This script contains raw secrets (DELETE AFTER RUNNING!)
 * - Never commit this file to version control
 * - Add to .gitignore immediately
 * - In production, use secure methods to provide secrets (env vars, secure files)
 */

import { PrismaClient } from '@prisma/client';
import { encrypt } from '../src/utils/crypto';

const prisma = new PrismaClient();

/**
 * ⚠️ SECURITY WARNING: Raw secrets below
 * Replace these with your actual secrets
 * DELETE THIS FILE after running!
 */
const SECRETS_TO_SEED = {
  // Example: Database connection string
  DATABASE_URL: 'postgresql://user:password@localhost:5432/offline_academy',

  // Example: JWT signing key
  JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',

  // Add more secrets as needed
  // SMTP_PASSWORD: 'your-smtp-password',
  // API_KEY: 'your-api-key',
};

/**
 * Target environment for these secrets
 */
const ENVIRONMENT = 'production'; // or 'development'

async function seedSecrets() {
  console.log('🔐 Starting secret seeding process...\n');

  try {
    // Verify MASTER_KEY is set
    if (!process.env.MASTER_KEY) {
      throw new Error(
        'MASTER_KEY not found in environment variables.\n' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      );
    }

    let successCount = 0;
    let errorCount = 0;

    // Process each secret
    for (const [key, rawValue] of Object.entries(SECRETS_TO_SEED)) {
      try {
        // Encrypt the secret value
        const encryptedValue = encrypt(rawValue);

        // Upsert to database (update if exists, create if not)
        await prisma.secret.upsert({
          where: {
            // Prisma requires the full composite unique key
            key_environment: {
              key,
              environment: ENVIRONMENT,
            }
          },
          update: {
            value: encryptedValue,
            environment: ENVIRONMENT,
            rotatedAt: new Date(),
          },
          create: {
            key,
            value: encryptedValue,
            environment: ENVIRONMENT,
            rotatedAt: new Date(),
          },
        });

        console.log(`✓ Seeded secret: ${key} (${ENVIRONMENT})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to seed secret: ${key}`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Seeding Summary:`);
    console.log(`   ✓ Successful: ${successCount}`);
    console.log(`   ✗ Failed: ${errorCount}`);

    if (successCount > 0) {
      console.log(`\n⚠️  IMPORTANT SECURITY STEPS:`);
      console.log(`   1. DELETE this script file immediately`);
      console.log(`   2. Verify secrets with: npx tsx scripts/verify-secrets.ts`);
      console.log(`   3. Test API: GET http://localhost:3000/api/secrets-test`);
      console.log(`   4. Never commit raw secrets to version control`);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seeding
seedSecrets()
  .then(() => {
    console.log('\n✓ Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
