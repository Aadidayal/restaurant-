const express = require('express');
const router = express.Router();

// Import route modules
const menuRoutes = require('./menuRoutes');
const reservationRoutes = require('./reservationRoutes');
const contactRoutes = require('./contactRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/menu', menuRoutes);
router.use('/reservation', reservationRoutes);
router.use('/contact', contactRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Rahul Sir Da Dhaba API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
