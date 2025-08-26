const express = require('express');
const router = express.Router();
const { getAllUsers, getAllReservations, getUserReservations } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Admin routes (for viewing data)
router.get('/users', getAllUsers);
router.get('/reservations', getAllReservations);

// User's own reservations
router.get('/my-reservations', auth, getUserReservations);

module.exports = router;
