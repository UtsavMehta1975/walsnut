-- Run these queries to verify your OTP setup is correct

-- 1. Check users table structure (should see phoneVerified column)
DESCRIBE users;

-- 2. Check otps table structure (should see all OTP fields)
DESCRIBE otps;

-- 3. Verify indexes on otps table
SHOW INDEXES FROM otps;

-- 4. Count records (should be 0 initially)
SELECT COUNT(*) as total_otps FROM otps;

-- 5. Show all tables (should see both users and otps)
SHOW TABLES;

-- Expected output:
-- - users table should have: id, email, phone, phoneVerified, emailVerified, etc.
-- - otps table should have: id, userId, email, phone, otp, type, purpose, attempts, maxAttempts, isVerified, expiresAt, createdAt
-- - Multiple indexes on otps table for performance

