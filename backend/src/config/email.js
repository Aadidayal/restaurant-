const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // Configure your email service here
  // Example for Gmail:
  /*
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  */
  
  // For development - log emails to console
  return nodemailer.createTransporter({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
};

module.exports = {
  createTransporter
};
