const mongoose = require('mongoose');

const tableAvailabilitySchema = new mongoose.Schema({
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent double booking
tableAvailabilitySchema.index({ table: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('TableAvailability', tableAvailabilitySchema);
