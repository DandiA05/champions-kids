-- This script will help you create a test admin user
-- Run this in your Neon PostgreSQL console AFTER running the migration.sql

-- First, let's create the admin user with a known password
-- Password: admin123
-- This is the bcrypt hash for "admin123"
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Test Admin',
  'admin@test.com',
  '$2a$10$rQZ9vK5xK5xK5xK5xK5xKOqH7Z9vK5xK5xK5xK5xK5xK5xK5xK5xK',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Note: The password hash above is a placeholder
-- You should generate a real bcrypt hash for your password
-- You can use the API to create the first admin user instead:
-- 
-- After the tables are created, you can manually insert an admin user
-- or temporarily modify the API to allow creating the first admin without authentication
