const { createTransporter } = require('../config/email');

// Handle contact form submissions
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }
    
    // Create contact submission data
    const contactData = {
      id: Date.now(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    console.log('New contact form submission:', contactData);
    
    // Optional: Send notification email to restaurant
    try {
      const transporter = createTransporter();
      
      // Email to restaurant
      const restaurantMailOptions = {
        from: email,
        to: process.env.RESTAURANT_EMAIL || 'info@rahulsirdadhaba.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      };
      
      // Auto-reply to customer
      const customerReplyOptions = {
        from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
        to: email,
        subject: 'Thank you for contacting Rahul Sir Da Dhaba',
        html: `
          <h2>Thank you for your message!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
          <p>Our team typically responds within 24 hours during business days.</p>
          <p>Best regards,<br>Rahul Sir Da Dhaba Team</p>
        `
      };
      
      await Promise.all([
        transporter.sendMail(restaurantMailOptions),
        transporter.sendMail(customerReplyOptions)
      ]);
      
    } catch (emailError) {
      console.log('Email notification error:', emailError.message);
      // Don't fail the contact form if email fails
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.',
      contactId: contactData.id
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error sending your message. Please try again.' 
    });
  }
};

// Get contact messages (for admin use)
const getContactMessages = (req, res) => {
  // This would typically query a database
  res.json({
    success: true,
    message: 'Contact messages retrieval feature for admin panel',
    data: []
  });
};

module.exports = {
  sendContactMessage,
  getContactMessages
};
