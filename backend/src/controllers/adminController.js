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
    const reservations = await Reservation.find({ user: req.user.userId });
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

module.exports = {
  getAllUsers,
  getAllReservations,
  getUserReservations
};
