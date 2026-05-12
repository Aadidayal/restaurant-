const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');
const {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
  checkTableAvailability,
  getAvailabilityByDate,
  seedDefaultTables,
  verifyAndFixTables
} = require('../controllers/tableController');

// Verify and fix tables endpoint (public for initialization)
router.get('/verify-and-fix', verifyAndFixTables);

// All other table routes require authentication and admin privileges
router.use(auth);
router.use(requireAdmin);

// Get all tables
router.get('/', getAllTables);

// Create a new table
router.post('/', createTable);

// Update table details
router.put('/:tableId', updateTable);

// Delete/Deactivate table
router.delete('/:tableId', deleteTable);

// Check availability for a date/time/guest count
router.get('/availability/check', checkTableAvailability);

// Get availability by date
router.get('/availability/:date', getAvailabilityByDate);

module.exports = router;
