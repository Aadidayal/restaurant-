const express = require('express');
const router = express.Router();
const { createReservation, getReservation } = require('../controllers/reservationController');

// Create a new reservation
router.post('/', createReservation);

// Get reservation by ID
router.get('/:id', getReservation);

module.exports = router;
