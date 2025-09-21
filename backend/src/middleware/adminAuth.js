const User = require('../models/User');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    req.user.role = user.role;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying admin status',
      error: error.message
    });
  }
};

module.exports = { requireAdmin };