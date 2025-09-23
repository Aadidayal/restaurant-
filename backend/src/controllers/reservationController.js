
const { createTransporter } = require('../config/email');
const Reservation = require('../models/Reservation');

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
    // Save to MongoDB
    const reservation = await Reservation.create({
      user: req.user.userId,
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      message: message || '',
      status: 'pending',
    });
    // Optional: Send confirmation email
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@rahulsirdadhaba.com',
        to: email,
        subject: 'Reservation Confirmation - Rahul Sir Da Dhaba',
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
          <p>Best regards,<br>Rahul Sir Da Dhaba Team</p>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log('Email notification error:', emailError.message);
    }
    res.json({
      success: true,
      message: 'Reservation request received! We will contact you shortly to confirm.',
      reservationId: reservation._id
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
const getReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findOne({ _id: id, user: req.user.userId });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching reservation' });
  }
};

module.exports = {
  createReservation,
  getReservation
};
