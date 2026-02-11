-- Admin Panel Database Schema
-- Run this SQL in your Neon PostgreSQL console

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'non-admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on role for authorization queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert a test admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$rQZ9vK5xK5xK5xK5xK5xKOqH7Z9vK5xK5xK5xK5xK5xK5xK5xK5xK',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Note: You'll need to update the password_hash above with an actual bcrypt hash
-- Or create the admin user through the API after setup
