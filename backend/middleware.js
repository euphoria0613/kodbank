const { verifyToken } = require('./auth');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
    try {
        // Extract token from cookie
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required. Please login.' 
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
        
        // Attach user info to request object
        req.user = {
            username: result.decoded.sub,
            role: result.decoded.role
        };
        
        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error during authentication' 
        });
    }
};

// Role-based access control middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'You do not have permission to access this resource' 
            });
        }
        
        next();
    };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    errorHandler
};
