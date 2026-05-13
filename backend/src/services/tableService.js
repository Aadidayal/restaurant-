const Table = require('../models/Table');
const TableAvailability = require('../models/TableAvailability');
const Reservation = require('../models/Reservation');

/**
 * Find available tables for a reservation
 * Returns list of tables that can accommodate the guests
 */
const findAvailableTables = async (date, time, guestCount) => {
  try {
    // Get all active tables sorted by capacity
    const allTables = await Table.find({ isActive: true }).sort({ capacity: 1 });
    console.log(`📋 Total active tables in DB: ${allTables.length}`);
    
    if (allTables.length === 0) {
      console.warn(`⚠️ NO TABLES IN DATABASE! Please seed tables first.`);
      return [];
    }

    // Debug: Show all tables and their capacities
    console.log(`📊 All tables: ${allTables.map(t => `${t.tableNumber}(${t.capacity})`).join(', ')}`);
    console.log(`🔍 Looking for tables that fit ${guestCount} guests...`);

    // Get booked tables for this date and time
    const bookedAvailabilities = await TableAvailability.find({
      date,
      timeSlot: time,
      isBooked: true
    }).select('table');

    const bookedTableIds = bookedAvailabilities.map(a => a.table.toString());
    console.log(`🔴 Booked tables on ${date} at ${time}: ${bookedTableIds.length}`);
    if (bookedTableIds.length > 0) {
      console.log(`   Booked table IDs: ${bookedAvailabilities.map(a => a.table.toString()).join(', ')}`);
    }

    // Filter available tables that can fit guests
    const availableTables = allTables.filter(table => {
      const isBooked = bookedTableIds.includes(table._id.toString());
      const canFit = guestCount > 0 && guestCount <= table.capacity;
      
      if (!isBooked && canFit) {
        console.log(`   ✓ Table ${table.tableNumber} (capacity ${table.capacity}) is AVAILABLE`);
      } else if (isBooked) {
        console.log(`   ✗ Table ${table.tableNumber} (capacity ${table.capacity}) is BOOKED`);
      } else if (!canFit) {
        console.log(`   ✗ Table ${table.tableNumber} (capacity ${table.capacity}) is TOO SMALL for ${guestCount} guests`);
      }
      
      return !isBooked && canFit;
    });

    console.log(`🟢 Available tables: ${availableTables.map(t => `${t.tableNumber}(${t.capacity}s)`).join(', ')}`);
    
    if (availableTables.length === 0) {
      console.warn(`⚠️ No single tables available. Max capacity: ${Math.max(...allTables.map(t => t.capacity))} seats`);
    }
    
    return availableTables;
  } catch (error) {
    console.error('Error finding available tables:', error);
    throw error;
  }
};

/**
 * Find best table combination for a group of guests
 * Tries to minimize wasted seats and prefer grouped seating
 * IMPROVED: More flexible logic that works for any valid guest count
 */
const findBestTableCombination = async (date, time, guestCount) => {
  try {
    console.log(`🔍 Searching tables for ${guestCount} guests on ${date} at ${time}`);
    const availableTables = await findAvailableTables(date, time, guestCount);

    console.log(`✅ Found ${availableTables.length} available tables: ${availableTables.map(t => t.tableNumber).join(', ')}`);

    if (availableTables.length === 0) {
      console.warn(`❌ No tables available for ${guestCount} guests on ${date} at ${time}`);
      return null;
    }

    const combinations = [];

    // Strategy 1: Find single table that perfectly fits
    // A table is suitable if: capacity >= guestCount >= 1
    for (let table of availableTables) {
      // Simple check: guests must fit in capacity (no minGuests constraint)
      if (guestCount <= table.capacity) {
        combinations.push({
          tableIds: [table._id],
          tables: [table],
          totalCapacity: table.capacity,
          totalTables: 1,
          fit: 'single',
          efficiency: ((guestCount / table.capacity) * 100).toFixed(2)
        });
      }
    }

    // Strategy 2: Find two-table combination for better grouping
    // Use two smaller tables instead of one large table when beneficial
    if (availableTables.length >= 2) {
      const sorted = [...availableTables].sort((a, b) => a.capacity - b.capacity);
      
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const totalCap = sorted[i].capacity + sorted[j].capacity;
          
          // Can combine if: total capacity fits all guests AND
          // guests exceed first table capacity (need both tables) AND
          // wasted seats is reasonable (max 5 empty seats allowed)
          if (guestCount <= totalCap && 
              guestCount > sorted[i].capacity &&
              (totalCap - guestCount) <= 5) {
            combinations.push({
              tableIds: [sorted[i]._id, sorted[j]._id],
              tables: [sorted[i], sorted[j]],
              totalCapacity: totalCap,
              totalTables: 2,
              fit: 'grouped',
              efficiency: ((guestCount / totalCap) * 100).toFixed(2)
            });
          }
        }
      }
    }

    // Sort by efficiency (highest first) then by least wasted seats
    combinations.sort((a, b) => {
      const effDiff = parseFloat(b.efficiency) - parseFloat(a.efficiency);
      if (effDiff !== 0) return effDiff;
      return (a.totalCapacity - guestCount) - (b.totalCapacity - guestCount);
    });

    if (combinations.length > 0) {
      console.log(`✅ Found ${combinations.length} valid combinations for ${guestCount} guests`);
      console.log(`   Best option: ${combinations[0].totalTables} table(s), ${combinations[0].totalCapacity} seats, ${combinations[0].efficiency}% efficiency`);
      return combinations[0];
    }
    
    console.warn(`❌ No valid table combinations for ${guestCount} guests on ${date} at ${time}`);
    return null;
  } catch (error) {
    console.error('Error finding best table combination:', error);
    throw error;
  }
};

/**
 * Assign tables to a reservation and mark them as booked
 */
const assignTablesToReservation = async (reservationId, tableIds, date, time) => {
  const session = await Reservation.startSession();
  session.startTransaction();

  try {
    console.log(`📌 Assigning ${tableIds.length} tables to reservation ${reservationId} on ${date} at ${time}`);
    
    // Check if tables are still available
    const bookedRecords = await TableAvailability.find({
      table: { $in: tableIds },
      date,
      timeSlot: time,
      isBooked: true
    }).session(session);

    if (bookedRecords.length > 0) {
      throw new Error('One or more tables were just booked by another user. Please try again.');
    }

    // Create or update availability records
    const availabilityRecords = [];
    const totalSeats = await Table.aggregate([
      { $match: { _id: { $in: tableIds } } },
      { $group: { _id: null, totalCapacity: { $sum: '$capacity' } } }
    ]).session(session);

    for (let tableId of tableIds) {
      let avail = await TableAvailability.findOne({
        table: tableId,
        date,
        timeSlot: time
      }).session(session);

      if (!avail) {
        avail = await TableAvailability.create(
          [
            {
              table: tableId,
              date,
              timeSlot: time,
              isBooked: true,
              reservation: reservationId
            }
          ],
          { session }
        );
        avail = avail[0];
        console.log(`   ✓ Created new TableAvailability record for table ${tableId}`);
      } else {
        avail.isBooked = true;
        avail.reservation = reservationId;
        await avail.save({ session });
        console.log(`   ✓ Updated existing TableAvailability record for table ${tableId}`);
      }

      availabilityRecords.push(avail._id);
    }

    // Update reservation with assigned tables
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        assignedTables: tableIds,
        totalSeatsAssigned: totalSeats[0]?.totalCapacity || 0,
        availabilityRecords: availabilityRecords
      },
      { new: true, session }
    ).populate('assignedTables');

    await session.commitTransaction();
    console.log(`✅ Successfully assigned ${availabilityRecords.length} tables to reservation`);
    return reservation;
  } catch (error) {
    await session.abortTransaction();
    console.error(`❌ Error assigning tables: ${error.message}`);
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Release tables when reservation is rejected
 */
const releaseTablesFromReservation = async (reservationId) => {
  try {
    const reservation = await Reservation.findById(reservationId);

    if (reservation && reservation.availabilityRecords.length > 0) {
      await TableAvailability.updateMany(
        { _id: { $in: reservation.availabilityRecords } },
        { isBooked: false, reservation: null }
      );

      await Reservation.findByIdAndUpdate(
        reservationId,
        {
          assignedTables: [],
          availabilityRecords: [],
          totalSeatsAssigned: 0
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error releasing tables:', error);
    throw error;
  }
};

/**
 * Get detailed availability report for a date
 */
const getAvailabilityReport = async (date) => {
  try {
    const timeSlots = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'];
    const report = {};

    console.log(`📅 Generating availability report for date: ${date}`);

    for (let time of timeSlots) {
      const bookedAvailability = await TableAvailability.find({
        date,
        timeSlot: time,
        isBooked: true
      }).populate('table reservation');

      const allTables = await Table.find({ isActive: true });
      const totalCapacity = allTables.reduce((sum, t) => sum + t.capacity, 0);
      const bookedCapacity = bookedAvailability.reduce((sum, a) => sum + (a.table?.capacity || 0), 0);

      console.log(`   ${time}: Found ${bookedAvailability.length} booked records, booked capacity: ${bookedCapacity}/${totalCapacity}`);

      report[time] = {
        bookedTables: bookedAvailability.map(a => ({
          tableNumber: a.table?.tableNumber,
          section: a.table?.section,
          capacity: a.table?.capacity,
          reservationGuests: a.reservation?.guests
        })),
        availableTables: allTables.length - bookedAvailability.length,
        totalTables: allTables.length,
        bookedCapacity,
        totalCapacity,
        occupancyRate: ((bookedCapacity / totalCapacity) * 100).toFixed(2) + '%',
        availableCapacity: totalCapacity - bookedCapacity
      };
    }

    return report;
  } catch (error) {
    console.error('Error generating availability report:', error);
    throw error;
  }
};

module.exports = {
  findAvailableTables,
  findBestTableCombination,
  assignTablesToReservation,
  releaseTablesFromReservation,
  getAvailabilityReport
};
