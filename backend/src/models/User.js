const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: function(password) {
        return password.length >= 6;
      },
      message: 'Password must be at least 6 characters long'
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: function() {
      return this.email.toLowerCase().includes('admin') ? 'admin' : 'user';
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
