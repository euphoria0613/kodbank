-- Kodbank Database Schema

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS UserToken;
DROP TABLE IF EXISTS KodUser;

-- Create KodUser table
CREATE TABLE KodUser (
    uid VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    phone VARCHAR(20),
    role ENUM('Customer', 'Manager', 'Admin') DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create UserToken table
CREATE TABLE UserToken (
    tid VARCHAR(255) PRIMARY KEY,
    token TEXT NOT NULL,
    uid VARCHAR(255) NOT NULL,
    expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE,
    INDEX idx_uid (uid),
    INDEX idx_token (token(255))
);

-- Index for better performance
CREATE INDEX idx_koduser_username ON KodUser(username);
CREATE INDEX idx_koduser_email ON KodUser(email);
