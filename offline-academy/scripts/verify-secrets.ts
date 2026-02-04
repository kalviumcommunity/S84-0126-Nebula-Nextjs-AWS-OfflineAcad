/**
 * 🔐 Secret Verification Script
 * 
 * Purpose: Verify secrets can be retrieved and decrypted correctly
 * 
 * Usage: npx tsx scripts/verify-secrets.ts
 * 
 * This script is SAFE to keep (doesn't expose secret values)
 */

import { PrismaClient } from '@prisma/client';
import { getSecret, listSecrets } from '../src/lib/secretManager';

const prisma = new PrismaClient();

async function verifySecrets() {
  console.log('🔐 Verifying secrets...\n');

  try {
    // List all secrets (metadata only, no values)
    console.log('📋 Secrets in database:');
    const secrets = await listSecrets();
    
    if (secrets.length === 0) {
      console.log('   ⚠️  No secrets found. Run seed-secrets.ts first.');
      return;
    }

    for (const secret of secrets) {
      console.log(`   - ${secret.key} (${secret.environment})`);
      console.log(`     Created: ${secret.createdAt.toISOString()}`);
      console.log(`     Rotated: ${secret.rotatedAt.toISOString()}\n`);
    }

    // Test retrieval and decryption
    console.log('🧪 Testing retrieval and decryption...\n');
    
    for (const secret of secrets) {
      try {
        const value = await getSecret(secret.key, secret.environment);
        const hasValue = value && value.length > 0;
        
        console.log(`   ✓ ${secret.key}: Retrieved successfully (length: ${value.length} chars)`);
      } catch (error) {
        console.error(`   ✗ ${secret.key}: Failed to retrieve`, error);
      }
    }

    console.log('\n✓ Verification complete!');
  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifySecrets()
  .then(() => {
    console.log('\n💡 Next steps:');
    console.log('   - Test API: GET http://localhost:3000/api/secrets-test');
    console.log('   - Delete seed-secrets.ts (contains raw secrets)');
    console.log('   - Keep this verification script for future checks');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
