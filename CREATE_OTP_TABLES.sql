-- ============================================
-- CREATE OTP TABLE - Manual Database Setup
-- ============================================
-- Run these queries directly in your MySQL database

-- Step 1: Add phoneVerified column to users table (if not exists)
ALTER TABLE users 
ADD COLUMN phoneVerified DATETIME DEFAULT NULL AFTER emailVerified;

-- Step 2: Create OTP table
CREATE TABLE IF NOT EXISTS otps (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    userId VARCHAR(191) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    otp VARCHAR(255) NOT NULL COMMENT 'Hashed OTP code',
    type ENUM('EMAIL', 'PHONE') NOT NULL,
    purpose ENUM('SIGNUP', 'LOGIN', 'RESET_PASSWORD', 'VERIFY_EMAIL', 'VERIFY_PHONE', 'TWO_FACTOR_AUTH') NOT NULL DEFAULT 'SIGNUP',
    attempts INT NOT NULL DEFAULT 0,
    maxAttempts INT NOT NULL DEFAULT 3,
    isVerified BOOLEAN NOT NULL DEFAULT FALSE,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to users table (optional, allows NULL for non-registered users)
    CONSTRAINT fk_otp_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for fast lookups
    INDEX idx_otp_email (email),
    INDEX idx_otp_phone (phone),
    INDEX idx_otp_user (userId),
    INDEX idx_otp_expires (expiresAt),
    INDEX idx_otp_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 3: Verify tables created successfully
SELECT 
    'OTP table created successfully!' as Status,
    COUNT(*) as RecordCount 
FROM otps;

SELECT 
    'Users table updated successfully!' as Status,
    COUNT(*) as UserCount 
FROM users;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if phoneVerified column exists
DESCRIBE users;

-- Check OTP table structure
DESCRIBE otps;

-- Show all indexes on OTP table
SHOW INDEXES FROM otps;

-- ============================================
-- OPTIONAL: CLEANUP QUERIES (if needed)
-- ============================================

-- Drop OTP table (if you need to recreate it)
-- DROP TABLE IF EXISTS otps;

-- Remove phoneVerified column (if you need to remove it)
-- ALTER TABLE users DROP COLUMN phoneVerified;

-- ============================================
-- TEST QUERIES (after implementation)
-- ============================================

-- View recent OTPs (for debugging)
-- SELECT id, email, phone, type, purpose, attempts, isVerified, expiresAt, createdAt 
-- FROM otps 
-- ORDER BY createdAt DESC 
-- LIMIT 10;

-- Count OTPs by type
-- SELECT type, COUNT(*) as count 
-- FROM otps 
-- GROUP BY type;

-- Find expired OTPs
-- SELECT COUNT(*) as expired_count 
-- FROM otps 
-- WHERE expiresAt < NOW() AND isVerified = FALSE;

-- Delete expired OTPs (cleanup)
-- DELETE FROM otps 
-- WHERE expiresAt < NOW() AND isVerified = FALSE;

