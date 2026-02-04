/**
 * 🔐 AES-256-CBC Encryption Utility
 * 
 * Purpose: Encrypt/decrypt secrets before storing in database
 * - Uses AES-256-CBC (industry-standard symmetric encryption)
 * - Master key from environment variable (MASTER_KEY)
 * - IV (Initialization Vector) stored with ciphertext for decryption
 * 
 * Security Notes:
 * - Never log the MASTER_KEY
 * - Rotate MASTER_KEY periodically
 * - Keep MASTER_KEY in secure environment variables only
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING: BufferEncoding = 'hex';

/**
 * Get the master encryption key from environment
 * Must be 32 bytes (64 hex characters) for AES-256
 */
function getMasterKey(): Buffer {
  const masterKey = process.env.MASTER_KEY;
  
  if (!masterKey) {
    throw new Error('MASTER_KEY environment variable is not set');
  }
  
  // Ensure key is exactly 32 bytes (64 hex chars)
  if (masterKey.length !== 64) {
    throw new Error('MASTER_KEY must be 64 hex characters (32 bytes)');
  }
  
  return Buffer.from(masterKey, 'hex');
}

/**
 * Encrypt plaintext using AES-256-CBC
 * 
 * @param text - The plaintext to encrypt (e.g., "postgres://user:pass@host:5432/db")
 * @returns Encrypted string in format: "iv:encryptedData" (both hex-encoded)
 * 
 * Example output: "a1b2c3d4....:e5f6g7h8...."
 */
export function encrypt(text: string): string {
  try {
    const key = getMasterKey();
    
    // Generate random IV (16 bytes for AES)
    // IV ensures same plaintext encrypts to different ciphertext each time
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);
    
    // Return IV + encrypted data (both needed for decryption)
    return `${iv.toString(ENCODING)}:${encrypted}`;
  } catch (error) {
    // Never log the actual text or error details (might contain secrets)
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt ciphertext using AES-256-CBC
 * 
 * @param encryptedText - The encrypted string in format "iv:encryptedData"
 * @returns Decrypted plaintext
 * 
 * ⚠️ CRITICAL: Only call this on server-side, never expose decrypted values to client
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getMasterKey();
    
    // Split IV and encrypted data
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], ENCODING);
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(encryptedData, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Never log error details (might contain partial decrypted data)
    throw new Error('Decryption failed');
  }
}

/**
 * Generate a random 32-byte master key (for initial setup)
 * 
 * Usage: Run this once and save output to .env as MASTER_KEY
 * Example: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export function generateMasterKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
