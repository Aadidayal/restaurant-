const { createTransporter } = require('../config/email');

// Handle reservation requests
const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }
    
    // Here you would typically save to a database
    const reservationData = {
      id: Date.now(), // Simple ID generation
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    console.log('New reservation received:', reservationData);
    
    // Optional: Send confirmation email
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@bellavista.com',
        to: email,
        subject: 'Reservation Confirmation - Bella Vista',
        html: `
          <h2>Reservation Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your reservation request. Here are the details:</p>
          <ul>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Guests:</strong> ${guests}</li>
            <li><strong>Special Requests:</strong> ${message || 'None'}</li>
          </ul>
          <p>We will contact you shortly to confirm your reservation.</p>
          <p>Best regards,<br>Bella Vista Team</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log('Email notification error:', emailError.message);
      // Don't fail the reservation if email fails
    }
    
    res.json({ 
      success: true, 
      message: 'Reservation request received! We will contact you shortly to confirm.',
      reservationId: reservationData.id
    });
    
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error processing your reservation. Please try again.' 
    });
  }
};

// Get reservation status (for future use)
const getReservation = (req, res) => {
  const { id } = req.params;
  
  // This would typically query a database
  res.json({
    success: true,
    message: 'Reservation lookup feature coming soon',
    reservationId: id
  });
};

module.exports = {
  createReservation,
  getReservation
};
