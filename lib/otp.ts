import crypto from 'crypto'
import bcrypt from 'bcrypt'

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Hash OTP for secure storage
 */
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10)
}

/**
 * Verify OTP against hashed value
 */
export async function verifyOTP(otp: string, hashedOTP: string): Promise<boolean> {
  return bcrypt.compare(otp, hashedOTP)
}

/**
 * Calculate OTP expiry time (default: 5 minutes from now)
 */
export function getOTPExpiry(minutes: number = 5): Date {
  return new Date(Date.now() + minutes * 60 * 1000)
}

/**
 * Check if OTP is expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt)
}

/**
 * Format phone number for SMS (remove spaces, dashes, etc.)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '')
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleanPhone = formatPhoneNumber(phone)
  // Indian phone numbers: 10 digits starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(cleanPhone)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

