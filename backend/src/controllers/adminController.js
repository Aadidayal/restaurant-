const User = require('../models/User');
const Reservation = require('../models/Reservation');

// Get all users (admin endpoint)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all reservations (admin endpoint)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('user', 'name email');
    res.json({
      success: true,
      count: reservations.length,
      reservations: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
};

// Get user's own reservations
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservations.length,
      reservations: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your reservations',
      error: error.message
    });
  }
};

// Update reservation status (admin only)
const updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status, adminResponse } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        status,
        adminResponse: adminResponse || '',
        reviewedBy: req.user.userId,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email');
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    res.json({
      success: true,
      message: `Reservation ${status} successfully`,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reservation status',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllReservations,
  getUserReservations,
  updateReservationStatus
};
