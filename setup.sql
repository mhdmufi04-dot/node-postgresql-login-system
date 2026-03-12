-- PostgreSQL Setup Script for Institute Management System

-- Make sure you're connected to your 'institute' database
-- Run: psql -U postgres -d institute -f setup.sql

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (passwords are hashed with bcrypt)
-- Default users: admin/admin123, student/student123
-- To create more users with hashed passwords, use bcrypt in Node.js
INSERT INTO users (username, password) VALUES
  ('admin', '$2b$10$fake_hashed_password_1'),
  ('student', '$2b$10$fake_hashed_password_2')
ON CONFLICT (username) DO NOTHING;

-- To generate proper bcrypt hashes, run this Node.js command:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_password', 10, (err, hash) => console.log(hash));"

-- For example, to hash 'admin123':
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10, (err, hash) => console.log(hash));"
-- Then update the users table with the actual hashes

-- Display the users table
SELECT * FROM users;