# 📧 Email Notification System Setup Guide

## Overview
This project includes a complete email notification system that sends automated emails for:
- ✅ Reservation confirmation (when user creates a reservation)
- 🎉 Reservation approval (when admin approves)
- ❌ Reservation rejection (when admin rejects)
- ⏰ Reservation reminders (24 hours before - can be scheduled)

## Email Templates
All emails are beautifully designed with HTML templates including:
- Professional styling
- Responsive design
- Restaurant branding
- Clear reservation details
- Contact information

## Setup Instructions

### Option 1: Gmail (Recommended for Testing)

1. **Create a Gmail Account** (or use existing)
   - Go to https://gmail.com
   - Create a new account or use your existing one

2. **Enable 2-Step Verification**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

3. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "The Spice Route"
   - Click "Generate"
   - Copy the 16-character password

4. **Update .env file in backend folder**
   ```env
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Option 2: Other Email Services

#### SendGrid
```env
EMAIL_SERVICE=SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_USER=noreply@yourdomain.com
```

#### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

Then update `backend/src/config/email.js`:
```javascript
return nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

#### Custom SMTP Server
```env
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## Email Triggers

### 1. Reservation Created
**Trigger:** User submits a reservation form
**Email:** Confirmation email with "PENDING" status
**Sent to:** User's email (from signup/login)
**Template:** Beautiful confirmation with all reservation details

### 2. Reservation Approved
**Trigger:** Admin approves reservation in Admin Portal
**Email:** Approval email with "CONFIRMED" status
**Sent to:** User's email
**Template:** Green-themed confirmation with reminders

### 3. Reservation Rejected
**Trigger:** Admin rejects reservation in Admin Portal
**Email:** Rejection email with alternative options
**Sent to:** User's email
**Template:** Includes admin's reason (if provided)

## Testing the Email System

### Development Mode (No Email Credentials)
If you don't set EMAIL_USER and EMAIL_PASS, emails will be logged to the console:
```
⚠️  Email credentials not configured. Emails will be logged to console only.
📧 To enable real emails, add EMAIL_USER and EMAIL_PASS to your .env file
```

### Production Mode (With Email Credentials)
1. Set up your .env file with email credentials
2. Restart your backend server
3. Create a test reservation
4. Check your email inbox
5. Check backend console for confirmation logs:
   ```
   ✅ Confirmation email sent to user@example.com
   ```

## Troubleshooting

### Emails Not Sending
1. **Check .env file** - Make sure EMAIL_USER and EMAIL_PASS are correct
2. **Gmail blocked?** - Enable "Less secure app access" or use App Password
3. **Check console logs** - Look for error messages
4. **Firewall issues** - Check if port 587/465 is blocked
5. **Wrong credentials** - Double-check email and password

### Common Errors

#### "Invalid login"
- Use App Password instead of regular password for Gmail
- Enable 2-Step Verification first

#### "Connection timeout"
- Check your internet connection
- Firewall might be blocking SMTP ports

#### "Email sent but not received"
- Check spam/junk folder
- Verify recipient email is correct
- Wait a few minutes (sometimes delayed)

### Error Logs
All email errors are logged to console:
```javascript
❌ Error sending confirmation email: [error message]
```

## Email Flow Diagram

```
User Creates Reservation
    ↓
Save to Database
    ↓
Send Confirmation Email ✉️
    ↓
User receives "Pending" email
    ↓
Admin Reviews in Portal
    ↓
Admin Approves/Rejects
    ↓
Send Approval/Rejection Email ✉️
    ↓
User receives final status email
```

## Customization

### Change Email Templates
Edit `backend/src/services/notificationService.js`
- Modify HTML templates in each function
- Update colors, logos, text
- Add more information

### Change "From" Name
```javascript
from: '"The Spice Route" <noreply@thespiceroute.com>'
```

### Add Attachments (e.g., menu PDF)
```javascript
mailOptions.attachments = [
  {
    filename: 'menu.pdf',
    path: './assets/menu.pdf'
  }
];
```

### Schedule Reminder Emails
Use a cron job or task scheduler:
```javascript
const cron = require('node-cron');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  // Find reservations for tomorrow
  // Send reminder emails
});
```

## Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use App Passwords** - Don't use main account password
3. **Rotate credentials** - Change passwords regularly
4. **Rate limiting** - Prevent spam (future enhancement)
5. **Validate emails** - Check format before sending

## Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] WhatsApp notifications
- [ ] Email templates with images/logo
- [ ] Scheduled reminder emails
- [ ] Cancellation confirmation emails
- [ ] Admin notification emails
- [ ] Email analytics/tracking
- [ ] Unsubscribe functionality
- [ ] Multi-language support

## Support

If you encounter issues:
1. Check this README
2. Check backend console logs
3. Verify .env configuration
4. Test with Gmail first (easiest)

## Example .env File

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-restaurant-email@gmail.com
EMAIL_PASS=your-app-password-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for links in emails)
FRONTEND_URL=http://localhost:3000
```

---

✨ **Your email notification system is now ready!** ✨

Users will receive beautiful, professional emails at every step of their reservation journey! 🎉
