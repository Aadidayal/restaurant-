const Table = require('../models/Table');
const TableAvailability = require('../models/TableAvailability');
const Reservation = require('../models/Reservation');

// Get all tables with detailed info
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
    res.json({
      success: true,
      count: tables.length,
      tables: tables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tables',
      error: error.message
    });
  }
};

// Create a new table (admin only)
const createTable = async (req, res) => {
  try {
    const { tableNumber, section, capacity, minGuests, maxGuests, tableType, description } = req.body;

    // Validate required fields
    if (!tableNumber || !capacity || !maxGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide tableNumber, capacity, and maxGuests'
      });
    }

    const table = await Table.create({
      tableNumber,
      section: section || 'Main Dining',
      capacity,
      minGuests: minGuests || 1,
      maxGuests,
      tableType: tableType || 'Single',
      description: description || ''
    });

    res.json({
      success: true,
      message: 'Table created successfully',
      table
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Table number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating table',
      error: error.message
    });
  }
};

// Update table details (admin only)
const updateTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { section, capacity, minGuests, maxGuests, tableType, isActive, description } = req.body;

    const table = await Table.findByIdAndUpdate(
      tableId,
      {
        section,
        capacity,
        minGuests,
        maxGuests,
        tableType,
        isActive,
        description,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table updated successfully',
      table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating table',
      error: error.message
    });
  }
};

// Delete table (soft delete - mark as inactive)
const deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await Table.findByIdAndUpdate(
      tableId,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    res.json({
      success: true,
      message: 'Table deactivated successfully',
      table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting table',
      error: error.message
    });
  }
};

// Check table availability for a specific date, time, and guest count
const checkTableAvailability = async (req, res) => {
  try {
    const { date, time, guestCount } = req.query;

    if (!date || !time || !guestCount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, time, and guestCount'
      });
    }

    const guests = parseInt(guestCount);
    
    // Find all active tables
    const allTables = await Table.find({ isActive: true }).sort({ capacity: 1 });

    // Get all booked tables for this date and time
    const bookedAvailabilities = await TableAvailability.find({
      date,
      timeSlot: time,
      isBooked: true
    }).populate('table');

    const bookedTableIds = bookedAvailabilities.map(a => a.table._id.toString());

    // Filter available tables - IMPROVED: Accept any table that fits capacity
    const availableTables = allTables.filter(table => {
      const isBooked = bookedTableIds.includes(table._id.toString());
      const canFitGuests = guests > 0 && guests <= table.capacity; // FIXED: More flexible
      return !isBooked && canFitGuests && table.isActive;
    });

    // Find optimal table combinations
    const optimalCombinations = findBestTableCombinations(availableTables, guests);

    res.json({
      success: true,
      date,
      time,
      guestCount: guests,
      availableTables: availableTables.map(t => ({
        _id: t._id,
        tableNumber: t.tableNumber,
        section: t.section,
        capacity: t.capacity,
        tableType: t.tableType
      })),
      recommendedCombinations: optimalCombinations,
      totalAvailable: availableTables.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

// Helper function to find best table combinations for a group
const findBestTableCombinations = (availableTables, guestCount) => {
  const combinations = [];

  // Sort tables by capacity
  const sorted = [...availableTables].sort((a, b) => a.capacity - b.capacity);

  // Try single tables first - IMPROVED: Accept any table that fits capacity
  for (let table of sorted) {
    if (guestCount <= table.capacity) {  // FIXED: Simple capacity check, not minGuests/maxGuests
      combinations.push({
        tables: [{ _id: table._id, tableNumber: table.tableNumber }],
        totalCapacity: table.capacity,
        totalTables: 1,
        fit: 'Single Table',
        wastedSeats: table.capacity - guestCount
      });
    }
  }

  // Try combinations of 2 tables for better efficiency
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const totalCapacity = sorted[i].capacity + sorted[j].capacity;
      // Can combine if: guests fit AND guests exceed single table capacity (need both) AND reasonable wasted seats
      if (guestCount <= totalCapacity && 
          guestCount > sorted[i].capacity && 
          (totalCapacity - guestCount) <= 5) {  // Allow up to 5 wasted seats
        combinations.push({
          tables: [
            { _id: sorted[i]._id, tableNumber: sorted[i].tableNumber },
            { _id: sorted[j]._id, tableNumber: sorted[j].tableNumber }
          ],
          totalCapacity: totalCapacity,
          totalTables: 2,
          fit: 'Two Tables - Grouped',
          wastedSeats: totalCapacity - guestCount
        });
      }
    }
  }

  // Sort by wasted seats (ascending) to find most efficient combination
  // Then remove duplicates keeping best options
  const sorted_combos = combinations.sort((a, b) => a.wastedSeats - b.wastedSeats);
  return sorted_combos.slice(0, 3);
};

// Get availability for a specific date
const getAvailabilityByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const timeSlots = ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
    const availability = {};

    for (let time of timeSlots) {
      const booked = await TableAvailability.find({
        date,
        timeSlot: time,
        isBooked: true
      }).populate('table', 'tableNumber capacity');

      const allTables = await Table.find({ isActive: true });
      const bookedCount = booked.length;
      const totalTables = allTables.length;

      availability[time] = {
        bookedTables: booked.map(b => b.table.tableNumber),
        availableTables: totalTables - bookedCount,
        totalTables: totalTables,
        occupancyRate: ((bookedCount / totalTables) * 100).toFixed(2) + '%'
      };
    }

    res.json({
      success: true,
      date,
      availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
};

// Verify and reseed tables if needed
const verifyAndFixTables = async (req, res) => {
  try {
    const { force } = req.query;  // force=true to always reseed
    
    // Define default tables
    const defaultTables = [
      { tableNumber: 'T1', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Corner window seat', isActive: true },
      { tableNumber: 'T2', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Near entrance', isActive: true },
      { tableNumber: 'T3', section: 'Main Dining', capacity: 4, minGuests: 2, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T4', section: 'Main Dining', capacity: 4, minGuests: 2, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T5', section: 'Main Dining', capacity: 4, minGuests: 2, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T6', section: 'Main Dining', capacity: 4, minGuests: 2, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T7', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating', isActive: true },
      { tableNumber: 'T8', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating', isActive: true },
      { tableNumber: 'P1', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella', isActive: true },
      { tableNumber: 'P2', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella', isActive: true },
      { tableNumber: 'P3', section: 'Patio', capacity: 8, minGuests: 1, maxGuests: 8, tableType: 'Group', description: 'Large outdoor group table', isActive: true },
      { tableNumber: 'PR1', section: 'Private Room', capacity: 12, minGuests: 1, maxGuests: 12, tableType: 'Group', description: 'Private function room', isActive: true },
      { tableNumber: 'PR2', section: 'Private Room', capacity: 10, minGuests: 1, maxGuests: 10, tableType: 'Group', description: 'Medium private room', isActive: true },
      { tableNumber: 'B1', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating', isActive: true },
      { tableNumber: 'B2', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating', isActive: true },
      { tableNumber: 'B3', section: 'Bar', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Bar', description: 'Bar high table', isActive: true },
    ];

    const existingCount = await Table.countDocuments();
    let message = '';
    let tables = [];

    if (existingCount > 0 && !force) {
      // Verify existing tables and fix inactive high-capacity tables
      const existingTables = await Table.find({}).sort({ capacity: 1 });
      console.log(`📋 Found ${existingTables.length} existing tables`);
      
      // Check for missing high-capacity tables and activate them if needed
      const capacities = existingTables.map(t => t.capacity);
      const maxCapacity = Math.max(...capacities);
      const inactiveHighCapacity = existingTables.filter(t => t.capacity >= 8 && !t.isActive);
      
      let fixes = [];
      
      // Activate any inactive high-capacity tables
      if (inactiveHighCapacity.length > 0) {
        console.log(`⚠️  Found ${inactiveHighCapacity.length} inactive high-capacity tables. Activating...`);
        for (let table of inactiveHighCapacity) {
          await Table.findByIdAndUpdate(table._id, { isActive: true });
          fixes.push(`Activated ${table.tableNumber} (capacity ${table.capacity})`);
        }
      }
      
      // Add missing high-capacity tables if needed
      if (maxCapacity < 10) {
        message = `⚠️  WARNING: Max table capacity is ${maxCapacity}. Cannot seat 10+ guests. Need to add high-capacity tables.`;
        
        // Add PR2 if it doesn't exist
        const hasPR2 = existingTables.some(t => t.tableNumber === 'PR2');
        if (!hasPR2) {
          const newTable = await Table.create({
            tableNumber: 'PR2',
            section: 'Private Room',
            capacity: 10,
            minGuests: 1,
            maxGuests: 10,
            tableType: 'Group',
            description: 'Medium private room',
            isActive: true
          });
          fixes.push(`Added PR2 (capacity ${newTable.capacity})`);
        }
      }
      
      // Reload tables after fixes
      tables = await Table.find({}).sort({ capacity: 1 });
      const newMaxCapacity = Math.max(...tables.map(t => t.capacity || 0));
      const activeCount = tables.filter(t => t.isActive).length;
      
      if (fixes.length > 0) {
        message = `✅ Fixed ${fixes.length} issues:\n${fixes.map(f => '  - ' + f).join('\n')}`;
      } else if (activeCount < existingTables.length) {
        message = `✅ Tables verified. ${activeCount} active (max capacity: ${newMaxCapacity})`;
      } else {
        message = `✅ Tables exist (${existingTables.length} total). Max capacity: ${newMaxCapacity}`;
      }
    } else if (force || existingCount === 0) {
      // Force reseed or first time
      if (existingCount > 0) {
        await Table.deleteMany({});
        console.log('🗑️  Cleared existing tables');
      }
      tables = await Table.insertMany(defaultTables);
      message = `✅ Successfully seeded ${tables.length} tables!`;
    }

    // Filter to only active tables for response
    const activeTables = tables.filter(t => t.isActive);
    
    res.json({
      success: true,
      message: message,
      count: activeTables.length,
      tables: activeTables.map(t => ({
        tableNumber: t.tableNumber,
        section: t.section,
        capacity: t.capacity,
        isActive: t.isActive
      })),
      summary: {
        totalTables: activeTables.length,
        maxCapacity: Math.max(...activeTables.map(t => t.capacity)),
        bySection: {
          'Main Dining': activeTables.filter(t => t.section === 'Main Dining').length,
          'Patio': activeTables.filter(t => t.section === 'Patio').length,
          'Private Room': activeTables.filter(t => t.section === 'Private Room').length,
          'Bar': activeTables.filter(t => t.section === 'Bar').length
        }
      }
    });
  } catch (error) {
    console.error('❌ Error verifying tables:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying/seeding tables',
      error: error.message
    });
  }
};

// Seed default tables (admin only, run once - with auto-reseed if capacity is missing)
const seedDefaultTables = async (req, res) => {
  try {
    const existingTables = await Table.countDocuments();
    
    if (existingTables > 0) {
      // Check if existing tables have sufficient capacity for large parties
      const existingDocs = await Table.find({});
      const maxCap = Math.max(...existingDocs.map(t => t.capacity || 0));
      
      if (maxCap < 10) {
        console.log(`⚠️  Max capacity is ${maxCap}, reseeding to ensure 10+ guest capacity...`);
        await Table.deleteMany({});
      } else {
        return res.status(400).json({
          success: false,
          message: `Tables already exist (${existingTables} found). Use /verify-and-fix endpoint to check/reseed.`,
          count: existingTables
        });
      }
    }

    // Define default tables with improved capacities for larger parties
    const defaultTables = [
      { tableNumber: 'T1', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Corner window seat', isActive: true },
      { tableNumber: 'T2', section: 'Main Dining', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Single', description: 'Near entrance', isActive: true },
      { tableNumber: 'T3', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T4', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T5', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T6', section: 'Main Dining', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Standard family table', isActive: true },
      { tableNumber: 'T7', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating', isActive: true },
      { tableNumber: 'T8', section: 'Main Dining', capacity: 6, minGuests: 1, maxGuests: 6, tableType: 'Group', description: 'Group seating', isActive: true },
      { tableNumber: 'P1', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella', isActive: true },
      { tableNumber: 'P2', section: 'Patio', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Double', description: 'Outdoor seating with umbrella', isActive: true },
      { tableNumber: 'P3', section: 'Patio', capacity: 8, minGuests: 1, maxGuests: 8, tableType: 'Group', description: 'Large outdoor group table', isActive: true },
      { tableNumber: 'PR1', section: 'Private Room', capacity: 12, minGuests: 1, maxGuests: 12, tableType: 'Group', description: 'Private function room', isActive: true },
      { tableNumber: 'PR2', section: 'Private Room', capacity: 10, minGuests: 1, maxGuests: 10, tableType: 'Group', description: 'Medium private room', isActive: true },
      { tableNumber: 'B1', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating', isActive: true },
      { tableNumber: 'B2', section: 'Bar', capacity: 2, minGuests: 1, maxGuests: 2, tableType: 'Bar', description: 'Bar counter seating', isActive: true },
      { tableNumber: 'B3', section: 'Bar', capacity: 4, minGuests: 1, maxGuests: 4, tableType: 'Bar', description: 'Bar high table', isActive: true },
    ];

    const createdTables = await Table.insertMany(defaultTables);

    res.json({
      success: true,
      message: `✅ Successfully seeded ${createdTables.length} default tables!`,
      count: createdTables.length,
      tables: createdTables.map(t => ({
        tableNumber: t.tableNumber,
        section: t.section,
        capacity: t.capacity,
        isActive: t.isActive
      })),
      summary: {
        maxCapacity: Math.max(...createdTables.map(t => t.capacity))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding tables',
      error: error.message
    });
  }
};

module.exports = {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
  checkTableAvailability,
  getAvailabilityByDate,
  seedDefaultTables,
  verifyAndFixTables
};
