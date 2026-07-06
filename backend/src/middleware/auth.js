const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'resumeiq_secret_key_2026';

// Global In-Memory users fallback database for Mock Mode
let mockUsers = [];

// Helper to get or set mockUsers globally so controllers share it
global.mockUsers = global.mockUsers || mockUsers;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if DB is in mock mode
      if (process.env.USE_MOCK_DB === 'true') {
        const mockUser = global.mockUsers.find(u => u._id.toString() === decoded.id);
        if (!mockUser) {
          return res.status(401).json({ success: false, message: 'Not authorized, mock user not found' });
        }
        req.user = mockUser;
      } else {
        // Get user from DB
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware] Verification failed:', error.message);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin permissions required' });
  }
};

module.exports = { protect, adminOnly, JWT_SECRET };
