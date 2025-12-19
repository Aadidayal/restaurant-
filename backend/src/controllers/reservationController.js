const Reservation = require('../models/Reservation');
const { 
  sendReservationConfirmation,
  sendReservationApproval,
  sendReservationRejection 
} = require('../services/notificationService');

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
    
    // Send confirmation email (non-blocking)
    sendReservationConfirmation(reservation).catch(err => {
      console.error('Email notification error:', err.message);
    });
    
    res.json({
      success: true,
      message: 'Reservation request received! A confirmation email has been sent to your email address.',
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
