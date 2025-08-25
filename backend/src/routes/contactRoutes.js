const express = require('express');
const router = express.Router();
const { sendContactMessage, getContactMessages } = require('../controllers/contactController');

// Send contact message
router.post('/', sendContactMessage);

// Get contact messages (admin only - for future use)
router.get('/', getContactMessages);

module.exports = router;
