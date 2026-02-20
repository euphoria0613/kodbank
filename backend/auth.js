const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// Hash password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (username, role) => {
    const payload = {
        sub: username,
        role: role
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRY
    });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        });
        return { valid: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, error: 'Token expired' };
        } else if (error.name === 'JsonWebTokenError') {
            return { valid: false, error: 'Invalid token' };
        }
        return { valid: false, error: error.message };
    }
};

// Calculate token expiry date
const calculateExpiryDate = (hours = 24) => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hours);
    return expiry;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    calculateExpiryDate
};
