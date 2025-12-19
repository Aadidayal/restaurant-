const { createTransporter } = require('../config/email');

/**
 * Send reservation confirmation email to user
 */
const sendReservationConfirmation = async (reservation) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
      to: reservation.email,
      subject: '🎉 Reservation Request Received - Rahul Sir Da Dhaba',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #ff6b35; }
            .details ul { list-style: none; padding: 0; }
            .details li { padding: 8px 0; border-bottom: 1px solid #eee; }
            .details li:last-child { border-bottom: none; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
            .status-badge { display: inline-block; padding: 5px 15px; background-color: #ffc107; color: #333; border-radius: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Rahul Sir Da Dhaba</h1>
            </div>
            <div class="content">
              <h2>Hello ${reservation.name}! 👋</h2>
              <p>Thank you for choosing Rahul Sir Da Dhaba! We've received your reservation request.</p>
              
              <div class="details">
                <h3>Reservation Details:</h3>
                <ul>
                  <li><strong>📅 Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li><strong>🕐 Time:</strong> ${reservation.time}</li>
                  <li><strong>👥 Number of Guests:</strong> ${reservation.guests}</li>
                  <li><strong>📧 Email:</strong> ${reservation.email}</li>
                  <li><strong>📱 Phone:</strong> ${reservation.phone}</li>
                  ${reservation.message ? `<li><strong>💬 Special Requests:</strong> ${reservation.message}</li>` : ''}
                  <li><strong>Status:</strong> <span class="status-badge">${reservation.status.toUpperCase()}</span></li>
                </ul>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <p>Our team will review your reservation and contact you shortly to confirm. You will receive another email once your reservation is approved.</p>
              
              <p>If you have any questions or need to make changes, please contact us at:</p>
              <p>📞 Phone: +91-XXXXXXXXXX<br>
              📧 Email: info@rahulsirdadhaba.com</p>
              
              <p>We look forward to serving you! 🙏</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Rahul Sir Da Dhaba. All rights reserved.</p>
              <p>Serving authentic Indian cuisine with love ❤️</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${reservation.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send reservation approval email to user
 */
const sendReservationApproval = async (reservation) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
      to: reservation.email,
      subject: '✅ Reservation Confirmed - Rahul Sir Da Dhaba',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745; }
            .details ul { list-style: none; padding: 0; }
            .details li { padding: 8px 0; border-bottom: 1px solid #eee; }
            .details li:last-child { border-bottom: none; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
            .status-badge { display: inline-block; padding: 5px 15px; background-color: #28a745; color: white; border-radius: 20px; font-weight: bold; }
            .highlight { background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎊 Reservation Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Great News, ${reservation.name}! 🎉</h2>
              <p>Your reservation at Rahul Sir Da Dhaba has been <strong>CONFIRMED</strong>!</p>
              
              <div class="highlight">
                <p style="margin: 0; font-size: 16px;"><strong>✨ We're excited to welcome you!</strong></p>
              </div>
              
              <div class="details">
                <h3>Confirmed Reservation Details:</h3>
                <ul>
                  <li><strong>📅 Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li><strong>🕐 Time:</strong> ${reservation.time}</li>
                  <li><strong>👥 Number of Guests:</strong> ${reservation.guests}</li>
                  <li><strong>📱 Phone:</strong> ${reservation.phone}</li>
                  ${reservation.message ? `<li><strong>💬 Special Requests:</strong> ${reservation.message}</li>` : ''}
                  <li><strong>Status:</strong> <span class="status-badge">CONFIRMED</span></li>
                </ul>
              </div>
              
              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Please arrive 10 minutes before your reservation time</li>
                <li>If you need to cancel or modify, please contact us at least 24 hours in advance</li>
                <li>For any special dietary requirements, please inform our staff upon arrival</li>
              </ul>
              
              <p><strong>Need to make changes?</strong></p>
              <p>Contact us at:<br>
              📞 Phone: +91-XXXXXXXXXX<br>
              📧 Email: info@rahulsirdadhaba.com</p>
              
              <p>We can't wait to serve you our delicious authentic Indian cuisine! 🍛</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Rahul Sir Da Dhaba. All rights reserved.</p>
              <p>Serving authentic Indian cuisine with love ❤️</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${reservation.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending approval email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send reservation rejection email to user
 */
const sendReservationRejection = async (reservation, reason = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
      to: reservation.email,
      subject: 'Reservation Update - Rahul Sir Da Dhaba',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
            .highlight { background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reservation Update</h1>
            </div>
            <div class="content">
              <h2>Dear ${reservation.name},</h2>
              <p>Thank you for your interest in dining at Rahul Sir Da Dhaba.</p>
              
              <div class="highlight">
                <p style="margin: 0;"><strong>Unfortunately, we are unable to confirm your reservation for the requested date and time.</strong></p>
              </div>
              
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
              
              <div class="details">
                <h3>Original Reservation Request:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>📅 Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>🕐 Time:</strong> ${reservation.time}</li>
                  <li style="padding: 8px 0;"><strong>👥 Guests:</strong> ${reservation.guests}</li>
                </ul>
              </div>
              
              <p><strong>We'd love to have you dine with us!</strong></p>
              <p>Please contact us to check availability for alternative dates and times:</p>
              <p>📞 Phone: +91-XXXXXXXXXX<br>
              📧 Email: info@rahulsirdadhaba.com</p>
              
              <p>We apologize for any inconvenience and hope to serve you soon! 🙏</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Rahul Sir Da Dhaba. All rights reserved.</p>
              <p>Serving authentic Indian cuisine with love ❤️</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${reservation.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending rejection email:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send reservation reminder email (24 hours before)
 */
const sendReservationReminder = async (reservation) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
      to: reservation.email,
      subject: '⏰ Reminder: Your Reservation Tomorrow - Rahul Sir Da Dhaba',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .details { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #17a2b8; }
            .footer { background-color: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Reservation Reminder</h1>
            </div>
            <div class="content">
              <h2>Hi ${reservation.name}! 👋</h2>
              <p>This is a friendly reminder about your upcoming reservation at Rahul Sir Da Dhaba.</p>
              
              <div class="details">
                <h3>Tomorrow's Reservation:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>📅 Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>🕐 Time:</strong> ${reservation.time}</li>
                  <li style="padding: 8px 0;"><strong>👥 Guests:</strong> ${reservation.guests}</li>
                </ul>
              </div>
              
              <p>We're excited to welcome you! Please arrive 10 minutes early.</p>
              
              <p>Need to cancel or modify? Contact us:<br>
              📞 Phone: +91-XXXXXXXXXX<br>
              📧 Email: info@rahulsirdadhaba.com</p>
              
              <p>See you tomorrow! 🍽️</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Rahul Sir Da Dhaba. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${reservation.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending reminder email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendReservationConfirmation,
  sendReservationApproval,
  sendReservationRejection,
  sendReservationReminder
};
