-- Fix hashedPassword to be nullable for OAuth users
USE walnut_db;
ALTER TABLE users MODIFY hashedPassword VARCHAR(191) NULL;

-- Verify the change
DESCRIBE users;

