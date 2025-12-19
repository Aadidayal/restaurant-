/**
 * Email Test Script
 * Run this to test if your email configuration is working
 * 
 * Usage: node testEmail.js
 */

require('dotenv').config();
const { sendReservationConfirmation } = require('./src/services/notificationService');

// Mock reservation data for testing
const testReservation = {
  name: 'Test User',
  email: 'your-test-email@example.com', // CHANGE THIS TO YOUR EMAIL
  phone: '+91-9876543210',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  time: '7:00 PM',
  guests: 4,
  message: 'Window seat preferred',
  status: 'pending'
};

console.log('🧪 Testing Email Notification System...\n');
console.log('📧 Sending test email to:', testReservation.email);
console.log('⚠️  Make sure to update the email address in testEmail.js before running!\n');

sendReservationConfirmation(testReservation)
  .then(result => {
    if (result.success) {
      console.log('\n✅ SUCCESS! Test email sent successfully!');
      console.log('📬 Check your inbox:', testReservation.email);
      console.log('📁 Also check spam/junk folder if not found\n');
    } else {
      console.log('\n❌ FAILED! Error sending test email');
      console.log('Error:', result.error);
      console.log('\n📖 Check EMAIL_SETUP.md for troubleshooting\n');
    }
  })
  .catch(error => {
    console.log('\n❌ FAILED! Error sending test email');
    console.log('Error:', error.message);
    console.log('\n📖 Check EMAIL_SETUP.md for troubleshooting');
    console.log('\nCommon issues:');
    console.log('1. EMAIL_USER and EMAIL_PASS not set in .env');
    console.log('2. Using regular password instead of App Password (Gmail)');
    console.log('3. 2-Step Verification not enabled (Gmail)');
    console.log('4. Firewall blocking SMTP ports\n');
  });
