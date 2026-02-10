/**
 * OTP Generation and Verification Utilities
 */

interface OTPStore {
  [email: string]: {
    otp: string;
    expiresAt: number;
    attempts: number;
  };
}

// In-memory OTP store (in production, use Redis or database)
const otpStore: OTPStore = {};

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('[OTP Generation] Generated 6-digit OTP:', otp);
  return otp;
}

/**
 * Store OTP with expiration (5 minutes)
 */
export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[email] = { otp, expiresAt, attempts: 0 };
  
  // Auto-cleanup after expiration
  setTimeout(() => {
    delete otpStore[email];
  }, 5 * 60 * 1000);
}

/**
 * Verify OTP
 */
export function verifyOTP(email: string, otp: string): { success: boolean; message: string } {
  const stored = otpStore[email];

  if (!stored) {
    return { success: false, message: "OTP not found or expired" };
  }

  // Check expiration
  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return { success: false, message: "OTP expired" };
  }

  // Check attempts (max 3)
  if (stored.attempts >= 3) {
    delete otpStore[email];
    return { success: false, message: "Too many failed attempts" };
  }

  // Verify OTP
  if (stored.otp !== otp) {
    stored.attempts++;
    return { success: false, message: "Invalid OTP" };
  }

  // Success - remove OTP
  delete otpStore[email];
  return { success: true, message: "OTP verified successfully" };
}

/**
 * Clear OTP for email
 */
export function clearOTP(email: string): void {
  delete otpStore[email];
}
