-- Add password field to users table for email/password authentication
ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL AFTER email;

-- Increase openId field length to support longer hex strings
ALTER TABLE users MODIFY COLUMN openId VARCHAR(128) NOT NULL UNIQUE;

-- Add index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

