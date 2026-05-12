/**
 * Seed script to create initial tables for the restaurant
 * Run this once to populate the database with default table configuration
 * Usage: node backend/src/data/seedTables.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Table = require('../models/Table');

const seedTables = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant');
    console.log('✅ Connected to MongoDB');

    // Clear existing tables
    await Table.deleteMany({});
    console.log('🗑️ Cleared existing tables');

    // Define default tables
    const defaultTables = [
      // Main Dining - Small tables (2 seaters)
      { tableNumber: 'T1', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Corner window seat' },
      { tableNumber: 'T2', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Near entrance' },
      
      // Main Dining - Medium tables (4 seaters)
      { tableNumber: 'T3', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table' },
      { tableNumber: 'T4', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table' },
      { tableNumber: 'T5', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table' },
      { tableNumber: 'T6', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table' },

      // Main Dining - Large tables (6 seaters)
      { tableNumber: 'T7', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating' },
      { tableNumber: 'T8', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating' },

      // Patio - Medium tables (4 seaters)
      { tableNumber: 'P1', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella' },
      { tableNumber: 'P2', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella' },

      // Patio - Large table (8 seaters)
      { tableNumber: 'P3', section: 'Patio', capacity: 8, minGuests: 1, maxGuests: 8, tableType: 'Group', description: 'Large outdoor group table' },

      // Private Room (can seat various sizes)
      { tableNumber: 'PR1', section: 'Private Room', capacity: 12, minGuests: 1, maxGuests: 12, tableType: 'Group', description: 'Private function room' },
      { tableNumber: 'PR2', section: 'Private Room', capacity: 10, minGuests: 1, maxGuests: 10, tableType: 'Group', description: 'Medium private room' },

      // Bar - High tables
      { tableNumber: 'B1', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating' },
      { tableNumber: 'B2', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating' },
      { tableNumber: 'B3', section: 'Bar', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Bar', description: 'Bar high table' },
    ];

    // Insert tables
    const createdTables = await Table.insertMany(defaultTables);
    console.log(`✅ Created ${createdTables.length} tables`);

    // Display summary
    console.log('\n📊 Table Summary:');
    console.log(`   Main Dining: 8 tables (capacity: 28)`);
    console.log(`   Patio: 3 tables (capacity: 16)`);
    console.log(`   Private Room: 2 tables (capacity: 22)`);
    console.log(`   Bar: 3 tables (capacity: 8)`);
    console.log(`   Total: 16 tables (capacity: 74)`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedTables();
