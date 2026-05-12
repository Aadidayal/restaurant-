const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Debug: Check if MONGODB_URI is loaded
    console.log('🔍 Checking MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
    console.log('🔍 URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)  ;
    process.exit(1);
  }
};

module.exports = connectDB;
























// “I use Mongoose to connect MongoDB via an async function that reads the connection string from environment variables. 
// I include validation, error handling, and stop the server if the connection fails to ensure reliability and security.”