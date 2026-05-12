# 🗄️ Database Verification Guide

## ✅ Current Status
All database connections are properly implemented:
- **Tables Collection** - Created with schema, indexes, and CRUD operations
- **TableAvailability Collection** - Created with compound unique index (prevents double-booking)
- **Reservation Model** - Enhanced with `assignedTables`, `totalSeatsAssigned`, `availabilityRecords`
- **Backend Controller** - Validates availability before approval and assigns tables atomically
- **Frontend Components** - Fetch and display data from MongoDB in real-time

## 📋 Database Schema Overview

### Tables Collection
```json
{
  "_id": "ObjectId",
  "tableNumber": "T1",
  "section": "Main Dining",
  "capacity": 2,
  "minGuests": 1,
  "maxGuests": 2,
  "tableType": "Single",
  "isActive": true,
  "description": "Corner window seat",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
**Index**: Unique on `tableNumber`

### TableAvailability Collection
```json
{
  "_id": "ObjectId",
  "table": "ObjectId (ref to Table)",
  "date": "YYYY-MM-DD",
  "timeSlot": "HH:mm",
  "isBooked": false,
  "reservation": "ObjectId (ref to Reservation)",
  "bookedBy": "ObjectId (ref to User)",
  "createdAt": "Date"
}
```
**Index**: Unique compound on `(table, date, timeSlot)` - Prevents double-booking

### Reservation Collection (Modified)
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref to User)",
  "name": "John Doe",
  "email": "john@example.com",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "guests": 10,
  "status": "approved",
  "adminResponse": "Assigned to: T7, P3",
  "assignedTables": ["ObjectId", "ObjectId"],
  "totalSeatsAssigned": 14,
  "availabilityRecords": ["ObjectId", "ObjectId"],
  "reviewedBy": "ObjectId (ref to User)",
  "reviewedAt": "Date",
  "createdAt": "Date"
}
```

## 🚀 Step-by-Step Verification

### Step 1: Seed Default Tables
Choose **ONE** method:

**Method A: Via Frontend Button (Recommended)**
1. Open AdminPortal in browser
2. Go to "🍽️ Table Management" tab
3. Click "Seed Default Tables" button
4. Confirm dialog
5. Should see ✅ "15 tables created successfully"

**Method B: Via API Call**
```bash
curl -X POST http://localhost:5000/api/tables/seed \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Method C: Via CLI (if no tables exist)**
```bash
node backend/src/data/seedTables.js
```

### Step 2: Verify Tables in Database

Check MongoDB directly:
```javascript
// In MongoDB Atlas or MongoDB Compass
db.tables.find().count()  // Should return 15

// View sample table
db.tables.findOne({ tableNumber: "T1" })
```

Expected output:
- 15 total tables
- Tables across 4 sections: Main Dining (8), Patio (3), Private Room (1), Bar (3)
- Total capacity: 64 seats

### Step 3: Create a Test Reservation

**From Frontend:**
1. Go to "Reservations" page
2. Create new reservation:
   - Name: "Test User"
   - Email: "test@example.com"
   - Date: Tomorrow
   - Time: 19:00 (7 PM)
   - Guests: 10
   - Message: "Window seat preference"
3. Click "Submit Reservation"
4. Should show "✅ Reservation submitted successfully"

### Step 4: Verify Reservation in Database

```javascript
db.reservations.findOne({ 
  status: 'pending',
  name: 'Test User'
})
// Should show:
// - status: 'pending'
// - assignedTables: [] (empty until approved)
// - totalSeatsAssigned: 0
// - availabilityRecords: [] (empty until approved)
```

### Step 5: Test Table Availability Check

**From AdminPortal:**
1. Go to Reservations tab
2. Click "Details" on pending reservation
3. Click "Check Available Tables"
4. System should show:
   - Available tables for the date/time/guests
   - Recommended table combination (e.g., "P3 (8 seats) + T7 (6 seats) = 14 seats")
   - Approval button

**Database Check:**
```javascript
// Check what's booked for this date/time
db.tableavailabilities.find({
  date: "2026-05-13",
  timeSlot: "19:00",
  isBooked: true
})
// Should be empty if no reservations exist
```

### Step 6: Approve Reservation and Assign Tables

**From AdminPortal:**
1. Click "Approve" button on pending reservation
2. System shows: "✅ Reservation APPROVED! Tables assigned: P3, T7 (14 seats)"
3. Admin response is auto-filled with table info

### Step 7: Verify Table Assignment in Database

```javascript
// Check reservation now has tables assigned
db.reservations.findOne({ 
  name: 'Test User',
  status: 'approved'
})
// Should show:
// - status: 'approved'
// - assignedTables: [ObjectId1, ObjectId2] (for P3 and T7)
// - totalSeatsAssigned: 14
// - availabilityRecords: [ObjectId, ObjectId]
// - reviewedBy: [admin's ObjectId]
// - reviewedAt: [approval timestamp]

// Verify availability records created
db.tableavailabilities.find({
  date: "2026-05-13",
  timeSlot: "19:00",
  isBooked: true
})
// Should show 2 records:
// - One for table P3 with isBooked: true, reservation: [reservation._id]
// - One for table T7 with isBooked: true, reservation: [reservation._id]
```

### Step 8: View Seating History

**From AdminPortal:**
1. Go to "📋 Seating History" tab
2. Should see the approved reservation with:
   - Customer name
   - Guest count (10)
   - Assigned tables (P3, T7)
   - Total seats (14)
   - Approval date and admin name

**Database Check:**
```javascript
db.reservations.find({
  status: 'approved',
  assignedTables: { $ne: [] }
})
// Should return the approved reservation(s)
```

### Step 9: Test Rejection (Release Tables)

**From AdminPortal:**
1. Create another pending reservation
2. Click "Details"
3. Click "Reject"
4. Enter rejection reason (optional)

**Verify in Database:**
```javascript
// Check rejected reservation
db.reservations.findOne({ 
  name: 'Test User',
  status: 'rejected'
})
// Should show:
// - status: 'rejected'
// - assignedTables: [] (cleared on rejection)
// - totalSeatsAssigned: 0
// - availabilityRecords: [] (cleared)

// Check availability records are released
db.tableavailabilities.find({
  reservation: ObjectId('the_rejected_reservation_id')
})
// Should show isBooked: false (released)
```

## 🔍 Common Issues and Solutions

### Issue 1: "No tables available" error on approval
**Cause**: Tables not seeded yet
**Solution**: 
1. Go to Table Management
2. Click "Seed Default Tables"
3. Confirm the 15 tables were created
4. Try approval again

### Issue 2: Seating History shows no records
**Cause**: No approved reservations with assigned tables yet
**Solution**:
1. Create a test reservation
2. Approve it (system will assign tables)
3. Seating history should now show it

### Issue 3: Can't create tables manually
**Cause**: Missing admin privileges
**Solution**:
1. Ensure logged in as admin user
2. Check admin field in User collection: `{ admin: true }`
3. Login again with correct admin account

### Issue 4: Availability check shows wrong tables
**Cause**: Previous test data blocking availability
**Solution**:
1. Go to MongoDB Atlas
2. Clear TableAvailability collection: `db.tableavailabilities.deleteMany({})`
3. Retry availability check

## 📊 Database Queries for Testing

```javascript
// Count tables
db.tables.find().count()

// Get table details
db.tables.find({ tableNumber: "T1" })

// Check today's bookings
db.tableavailabilities.find({
  date: "2026-05-12",
  isBooked: true
})

// Get approved reservations with assigned tables
db.reservations.find({
  status: 'approved',
  assignedTables: { $exists: true, $ne: [] }
}).pretty()

// Get pending reservations
db.reservations.find({
  status: 'pending'
}).pretty()

// Check specific user's reservations
db.reservations.find({
  email: 'test@example.com'
}).pretty()
```

## ✅ Data Flow Verification Checklist

- [ ] 15 default tables exist in Tables collection
- [ ] Each table has correct capacity and min/max guests
- [ ] Can create new reservation from frontend
- [ ] Reservation appears in AdminPortal with pending status
- [ ] Can check availability for pending reservation
- [ ] System shows available tables and recommendations
- [ ] Can approve reservation
- [ ] Reservation status changes to "approved"
- [ ] Assigned tables are stored in reservation document
- [ ] TableAvailability records created with isBooked: true
- [ ] Seating History shows approved reservations
- [ ] Can reject reservation
- [ ] Rejection releases tables (TableAvailability.isBooked = false)
- [ ] Can create custom table and see it in availability check
- [ ] Table Management shows all tables in a grid
- [ ] Deletion soft-deletes tables (isActive: false)

## 🎯 What's Connected to Database

### ✅ Write Operations (Data Stored)
- Table CRUD: `POST /api/tables`, `PUT /api/tables/{id}`, `DELETE /api/tables/{id}`
- Reservation creation: `POST /api/reservations`
- Reservation approval: `PUT /admin/reservations/{id}/status`
  - Creates/updates TableAvailability records
  - Updates Reservation.assignedTables[]
  - Records approval info (reviewedBy, reviewedAt)
- Reservation rejection: `PUT /admin/reservations/{id}/status`
  - Clears assignedTables[]
  - Marks TableAvailability.isBooked = false

### ✅ Read Operations (Data Displayed)
- Get all tables: `GET /api/tables` → TableManagement component
- Check availability: `GET /api/tables/availability/check` → AdminPortal
- Get availability by date: `GET /api/tables/availability/{date}` → Availability report
- Get all reservations: `GET /admin/reservations` → AdminPortal
- Get seating history: `GET /admin/seating-history` → Seating History tab
  - Populates user, assignedTables, reviewedBy references

### ✅ Transactions (Atomic Operations)
- Table assignment uses MongoDB sessions to ensure:
  1. Check if tables still available (race condition protection)
  2. Create TableAvailability records
  3. Update Reservation document
  4. All-or-nothing: Either all succeed or all rollback

## 🚀 Next Steps

1. **Seed Tables** (if not done yet)
2. **Create Test Reservation** from frontend
3. **Approve Reservation** from admin and verify table assignment
4. **Check Seating History** to see the audit trail
5. **Run MongoDB queries** to verify data structure
6. **Test Edge Cases**:
   - Overlapping reservation times (should block if no tables)
   - Multiple 4-seater tables when single 8-seater available
   - Rejection should free up tables for other reservations

---

**Last Updated**: After implementing seating history and table management
**Status**: All database connections ready for testing
**Next**: Execute seeding and test full reservation approval flow
