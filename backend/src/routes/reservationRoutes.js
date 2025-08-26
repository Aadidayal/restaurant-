const express = require('express');
const router = express.Router();

const { createReservation, getReservation } = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// Create a new reservation (auth required)
router.post('/', auth, createReservation);

// Get reservation by ID (auth required)
router.get('/:id', auth, getReservation);

module.exports = router;
