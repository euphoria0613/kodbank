const express = require('express');
const router = express.Router();
const { pool } = require('./db');
const { hashPassword, comparePassword, generateToken, calculateExpiryDate, verifyToken } = require('./auth');
const { v4: uuidv4 } = require('crypto');

// Generate unique ID
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { uid, uname, password, email, phone, role } = req.body;
        
        // Validation
        if (!uid || !uname || !password || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT username, email FROM KodUser WHERE username = ? OR email = ?',
            [uname, email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Username or email already exists'
            });
        }
        
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Insert user with default balance of 100000
        await pool.query(
            'INSERT INTO KodUser (uid, username, email, password, balance, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [uid, uname, email, hashedPassword, 100000.00, phone, role || 'Customer']
        );
        
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login.',
            redirect: '/login.html'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        
        // Find user
        const [users] = await pool.query(
            'SELECT uid, username, email, password, role FROM KodUser WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        const user = users[0];
        
        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        
        // Generate JWT token
        const token = generateToken(user.username, user.role);
        
        // Calculate expiry date
        const expiryDate = calculateExpiryDate(24);
        
        // Store token in database
        const tid = generateId();
        await pool.query(
            'INSERT INTO UserToken (tid, token, uid, expiry) VALUES (?, ?, ?, ?)',
            [tid, token, user.uid, expiryDate]
        );
        
        // Set token as HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.json({
            success: true,
            message: 'Login successful!',
            redirect: '/dashboard.html',
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.'
        });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (token) {
            // Delete token from database
            await pool.query('DELETE FROM UserToken WHERE token = ?', [token]);
        }
        
        // Clear cookie
        res.clearCookie('token');
        
        res.json({
            success: true,
            message: 'Logout successful!',
            redirect: '/login.html'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed. Please try again.'
        });
    }
});

// Check balance endpoint (protected)
router.get('/balance', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        // Verify token
        const result = verifyToken(token);
        
        if (!result.valid) {
            return res.status(401).json({
                success: false,
                message: result.error
            });
        }
        
        const username = result.decoded.sub;
        
        // Fetch user balance
        const [users] = await pool.query(
            'SELECT balance FROM KodUser WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            balance: users[0].balance
        });
    } catch (error) {
        console.error('Balance check error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch balance'
        });
    }
});

// Get current user info (protected)
router.get('/user', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        // Verify token
        const result = verifyToken(token);
        
        if (!result.valid) {
            return res.status(401).json({
                success: false,
                message: result.error
            });
        }
        
        const username = result.decoded.sub;
        
        // Fetch user info
        const [users] = await pool.query(
            'SELECT uid, username, email, phone, role FROM KodUser WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('User info error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user info'
        });
    }
});

module.exports = router;
