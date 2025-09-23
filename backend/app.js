const dotenv = require('dotenv');
// Load environment variables FIRST
dotenv.config();

const express = require('express');
const cors = require('cors');

// Import middleware
const { logger, requestLogger } = require('./src/middleware/logger');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

// Import routes
const apiRoutes = require('./src/routes');

// Connect to MongoDB Atlas
const connectDB = require('./src/config/db');
connectDB();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(logger);
app.use(requestLogger);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to Rahul Sir Da Dhaba API!',
    version: '1.0.0',
    endpoints: {
      menu: '/api/menu',
      reservations: '/api/reservation',
      contact: '/api/contact',
      health: '/api/health'
    }
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
🍽️  Rahul Sir Da Dhaba API Server
🚀 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📊 API Health Check: http://localhost:${PORT}/api/health
📖 API Documentation: http://localhost:${PORT}/
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;