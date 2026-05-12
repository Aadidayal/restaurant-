const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { 
  sendReservationApproval,
  sendReservationRejection 
} = require('../services/notificationService');
const {
  findBestTableCombination,
  assignTablesToReservation,
  releaseTablesFromReservation,
  getAvailabilityReport
} = require('../services/tableService');

// Get all users (admin endpoint)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get all reservations (admin endpoint)
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate('user', 'name email'); // replaces userId with actual user data
    res.json({
      success: true,
      count: reservations.length,
      reservations: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
};

// Get user's own reservations
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId }).sort({ createdAt: -1 }); //comes from JWT middleware So:
    //                                                                                    Each user sees only their own reservations
    res.json({
      success: true,
      count: reservations.length,
      reservations: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your reservations',
      error: error.message
    });
  }
};

// Update reservation status (admin only)
const updateReservationStatus = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { status, adminResponse } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, approved, or rejected'
      });
    }
    
    const reservation = await Reservation.findById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // ========== CRITICAL: Check table availability before approval ==========
    if (status === 'approved') {
      try {
        // First, check if any tables exist in the system
        const totalTables = await Table.countDocuments({ isActive: true });
        if (totalTables === 0) {
          return res.status(400).json({
            success: false,
            message: `❌ No tables configured in the system! Admin needs to set up tables first. Please go to Table Management and add tables.`,
            availabilityCheckFailed: true,
            noTablesConfigured: true
          });
        }

        // Find best table combination for this reservation
        const bestCombination = await findBestTableCombination(
          reservation.date,
          reservation.time,
          reservation.guests
        );

        if (!bestCombination) {
          // Try to find available times on the same date for helpful suggestion
          const availableTimesOnDate = [];
          const timeSlotsToCheck = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
          
          for (const timeSlot of timeSlotsToCheck) {
            if (timeSlot !== reservation.time) {
              const altCombination = await findBestTableCombination(
                reservation.date,
                timeSlot,
                reservation.guests
              );
              if (altCombination) {
                availableTimesOnDate.push(timeSlot);
              }
            }
          }

          let suggestion = `Ask customer to choose a different date or time.`;
          if (availableTimesOnDate.length > 0) {
            suggestion += ` Available times on ${reservation.date}: ${availableTimesOnDate.join(', ')}`;
          }

          console.warn(`❌ No tables available for ${reservation.guests} guests on ${reservation.date} at ${reservation.time}`);

          return res.status(400).json({
            success: false,
            message: `❌ No available seating for ${reservation.guests} guests on ${reservation.date} at ${reservation.time}. ${availableTimesOnDate.length > 0 ? 'Try: ' + availableTimesOnDate.join(', ') : 'Please suggest customer to choose an alternative date/time.'}`,
            availabilityCheckFailed: true,
            suggestedTimes: availableTimesOnDate.length > 0 ? availableTimesOnDate : null,
            suggestion: suggestion
          });
        }

        // Assign tables to this reservation
        const updatedReservation = await assignTablesToReservation(
          reservationId,
          bestCombination.tableIds,
          reservation.date,
          reservation.time
        );

        // Now update the status
        const finalReservation = await Reservation.findByIdAndUpdate(
          reservationId,
          {
            status: 'approved',
            adminResponse: adminResponse || `Assigned to: ${bestCombination.tables.map(t => t.tableNumber).join(', ')}`,
            reviewedBy: req.user.userId,
            reviewedAt: new Date()
          },
          { new: true }
        ).populate('user', 'name email').populate('assignedTables');

        // Send approval email
        sendReservationApproval(finalReservation).catch(err => {
          console.error('Email notification error:', err.message);
        });

        return res.json({
          success: true,
          message: `✅ Reservation APPROVED! Tables assigned: ${bestCombination.tables.map(t => t.tableNumber).join(', ')} (${bestCombination.totalCapacity} seats)`,
          reservation: finalReservation,
          assignedTables: bestCombination.tables.map(t => ({
            tableNumber: t.tableNumber,
            section: t.section,
            capacity: t.capacity
          }))
        });
      } catch (error) {
        console.error('Table assignment error:', error);
        return res.status(400).json({
          success: false,
          message: `Error assigning tables: ${error.message}`
        });
      }
    }
    // ========== END TABLE AVAILABILITY CHECK ==========

    // Handle rejection
    if (status === 'rejected') {
      // Release any assigned tables
      await releaseTablesFromReservation(reservationId);

      const finalReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        {
          status: 'rejected',
          adminResponse: adminResponse || '',
          reviewedBy: req.user.userId,
          reviewedAt: new Date(),
          assignedTables: [],
          availabilityRecords: [],
          totalSeatsAssigned: 0
        },
        { new: true }
      ).populate('user', 'name email');

      // Send rejection email
      sendReservationRejection(finalReservation, adminResponse).catch(err => {
        console.error('Email notification error:', err.message);
      });

      return res.json({
        success: true,
        message: `Reservation REJECTED. Email notification sent to customer.`,
        reservation: finalReservation
      });
    }
  } catch (error) {
    console.error('Reservation update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reservation status',
      error: error.message
    });
  }
};

// Get availability snapshot for a specific date (for admin dashboard)
const getAvailabilitySnapshot = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const report = await getAvailabilityReport(date);

    res.json({
      success: true,
      date,
      availabilityReport: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability snapshot',
      error: error.message
    });
  }
};

// Get seating history/trail - track all approved reservations with their assigned tables
const getSeatingHistory = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;

    let query = {
      status: 'approved',
      assignedTables: { $exists: true, $ne: [] }
    };

    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const seatingHistory = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('assignedTables', 'tableNumber section capacity')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const formattedHistory = seatingHistory.map(res => ({
      _id: res._id,
      customerName: res.name,
      customerEmail: res.email,
      guestCount: res.guests,
      reservationDate: res.date,
      reservationTime: res.time,
      assignedTables: res.assignedTables.map(t => ({
        tableNumber: t.tableNumber,
        section: t.section,
        capacity: t.capacity
      })),
      totalSeatsAssigned: res.totalSeatsAssigned,
      approvalDate: res.reviewedAt,
      approvedBy: res.reviewedBy?.name || 'System',
      specialRequests: res.message || 'None'
    }));

    res.json({
      success: true,
      count: formattedHistory.length,
      seatingHistory: formattedHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching seating history',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllReservations,
  getUserReservations,
  updateReservationStatus,
  getAvailabilitySnapshot,
  getSeatingHistory
};
// “This controller manages user and reservation data. 
// It includes admin endpoints for fetching all users and reservations, and user-specific endpoints for viewing
//  personal reservations. It also allows admins to update reservation status with validation and sends asynchronous
//  email notifications using a service layer.”