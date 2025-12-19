const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // Check if email credentials are configured
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production: Use Gmail or other email service
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password for Gmail
      }
    });
  } else {
    // Development: Log emails to console
    console.log('⚠️  Email credentials not configured. Emails will be logged to console only.');
    console.log('📧 To enable real emails, add EMAIL_USER and EMAIL_PASS to your .env file');
    
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }
};

module.exports = {
  createTransporter
};
