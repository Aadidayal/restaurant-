const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  section: {
    type: String,
    enum: ['Main Dining', 'Patio', 'Private Room', 'Bar', 'Lounge'],
    default: 'Main Dining'
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  minGuests: {
    type: Number,
    default: 1,
    min: 1
  },
  maxGuests: {
    type: Number,
    required: true
  },
  tableType: {
    type: String,
    enum: ['Single', 'Double', 'Group', 'Bar'],
    default: 'Single'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tableSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Table', tableSchema);
