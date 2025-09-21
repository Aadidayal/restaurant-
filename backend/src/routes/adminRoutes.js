const express = require('express');
const router = express.Router();
const { getAllUsers, getAllReservations, getUserReservations, updateReservationStatus } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

// Admin routes (require admin privileges)
router.get('/users', auth, requireAdmin, getAllUsers);
router.get('/reservations', auth, requireAdmin, getAllReservations);
router.put('/reservations/:reservationId/status', auth, requireAdmin, updateReservationStatus);

// User's own reservations
router.get('/my-reservations', auth, getUserReservations);

module.exports = router;
