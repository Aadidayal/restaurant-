# 🔗 Complete Database Connection Map

## Backend Database Layers

### Layer 1: MongoDB Models (Schema + Indexes)
```
✅ backend/src/models/Table.js
   ├─ Collection: tables
   ├─ Fields: tableNumber(unique), section, capacity, minGuests, maxGuests, tableType, isActive
   └─ Index: Unique on tableNumber

✅ backend/src/models/TableAvailability.js
   ├─ Collection: tableavailabilities
   ├─ Fields: table(ref), date, timeSlot, isBooked, reservation(ref), bookedBy(ref)
   └─ Index: Unique compound on (table, date, timeSlot)

✅ backend/src/models/Reservation.js
   ├─ Collection: reservations
   ├─ NEW Fields: assignedTables[], totalSeatsAssigned, availabilityRecords[]
   └─ References: user, reviewedBy, assignedTables, availabilityRecords
```

### Layer 2: Business Logic Services
```
✅ backend/src/services/tableService.js
   ├─ findAvailableTables() → Queries Table + TableAvailability collections
   ├─ findBestTableCombination() → Smart algorithm returns optimal table combo
   ├─ assignTablesToReservation() → ATOMIC TRANSACTION:
   │  ├─ Check if tables still available
   │  ├─ Create/update TableAvailability records (isBooked: true)
   │  ├─ Update Reservation (assignedTables[], totalSeatsAssigned)
   │  └─ Uses MongoDB sessions for rollback on error
   ├─ releaseTablesFromReservation() → Clears assignedTables on rejection
   └─ getAvailabilityReport() → Generates occupancy summary
```

### Layer 3: Controllers (Business Rules)
```
✅ backend/src/controllers/tableController.js
   ├─ getAllTables() → SELECT * FROM tables WHERE isActive=true
   ├─ createTable() → INSERT INTO tables (validates & saves to DB)
   ├─ updateTable() → UPDATE tables SET ... WHERE _id=...
   ├─ deleteTable() → UPDATE tables SET isActive=false WHERE _id=...
   ├─ checkTableAvailability() → Calls tableService.findBestTableCombination()
   ├─ getAvailabilityByDate() → Aggregates TableAvailability for date
   └─ seedDefaultTables() → INSERT 15 default tables from array

✅ backend/src/controllers/adminController.js (MODIFIED)
   ├─ updateReservationStatus() → CRITICAL FIX:
   │  ├─ Check total tables exist (COUNT FROM tables)
   │  ├─ If status='approved':
   │  │  ├─ Call findBestTableCombination() → finds available tables
   │  │  ├─ If no tables → REJECT approval (prevents loophole ✅)
   │  │  └─ Call assignTablesToReservation() → assigns & saves tables
   │  ├─ If status='rejected':
   │  │  └─ Call releaseTablesFromReservation() → frees tables
   │  └─ Update Reservation (status, adminResponse, reviewedBy, reviewedAt)
   └─ getSeatingHistory() → SELECT * FROM reservations WHERE:
      ├─ status='approved'
      ├─ assignedTables != empty
      └─ POPULATE user, assignedTables, reviewedBy (References!)
```

### Layer 4: REST API Routes
```
✅ backend/src/routes/tableRoutes.js
   ├─ POST   /api/tables/seed           → tableController.seedDefaultTables()
   ├─ GET    /api/tables                → tableController.getAllTables()
   ├─ POST   /api/tables                → tableController.createTable()
   ├─ PUT    /api/tables/:id            → tableController.updateTable()
   ├─ DELETE /api/tables/:id            → tableController.deleteTable()
   └─ GET    /api/tables/availability/* → tableController.checkTableAvailability()

✅ backend/src/routes/adminRoutes.js (MODIFIED)
   ├─ PUT    /admin/reservations/:id/status → adminController.updateReservationStatus()
   │                                           (NOW checks availability BEFORE approval)
   └─ GET    /admin/seating-history         → adminController.getSeatingHistory()
```

### Layer 5: Database Connection
```
✅ backend/src/config/db.js
   └─ Connects to MongoDB via MONGODB_URI env variable
      (Status: Connected ✅ when backend starts)
```

---

## Frontend Data Flow

### API Integration Points
```
✅ frontend/src/config/api.js
   └─ API_ENDPOINT = "http://localhost:5000/api"
```

### Components Connected to Database

```
✅ frontend/src/components/TableManagement.js
   ├─ Reads from DB:
   │  ├─ GET /api/tables → Fetches all tables
   │  └─ GET /api/tables/availability/check → Checks available tables
   ├─ Writes to DB:
   │  ├─ POST /api/tables → Create new table
   │  ├─ PUT /api/tables/{id} → Update table
   │  └─ DELETE /api/tables/{id} → Delete (soft) table
   ├─ Special: POST /api/tables/seed → Seeds 15 default tables
   └─ Display: Grid of all tables with stats & availability

✅ frontend/src/components/AdminPortal.js (MODIFIED)
   ├─ On Mount - Fetches:
   │  ├─ GET /admin/reservations → All reservations
   │  ├─ GET /admin/users → All users (for reviewer names)
   │  ├─ GET /api/tables → Count tables to show warning
   │  └─ GET /admin/seating-history → Approved reservations with tables
   ├─ On Reservation Details - Fetches:
   │  └─ GET /api/tables/availability/check → Available tables for date/time/guests
   ├─ On Approve/Reject - Sends:
   │  └─ PUT /admin/reservations/{id}/status → Updates DB + assigns/releases tables
   ├─ Displays:
   │  ├─ ⚠️ Warning banner if no tables configured
   │  ├─ 📋 Seating History tab → Shows audit trail of all approved reservations
   │  ├─ 🍽️ Table Management tab → Embedded TableManagement component
   │  └─ Available tables in reservation detail modal
   └─ Real-time Updates: All changes reflect in reservations list

✅ frontend/src/components/Reservations.js (UNCHANGED)
   ├─ Reads: GET /api/reservations → User's own reservations
   └─ Writes: POST /api/reservations → Create new reservation

✅ Other Components (Unchanged)
   ├─ Home.js - Display only
   ├─ Menu.js - Display only
   ├─ Login.js → POST /auth/login (auth)
   ├─ Signup.js → POST /auth/signup (auth)
   └─ Contact.js → POST /contact (email)
```

---

## Complete Data Flow Examples

### ✅ Example 1: Create Table
```
Frontend: User clicks "Create Table" in TableManagement
    ↓
Frontend: Sends POST /api/tables
    { tableNumber: "T10", section: "Main Dining", capacity: 4, minGuests: 2, maxGuests: 4 }
    ↓
Backend: tableController.createTable()
    ├─ Validates input
    ├─ Saves to Table collection
    └─ Returns created table
    ↓
Frontend: Adds table to tables[] state, updates grid display
    ↓
MongoDB: tables collection now has new document
```

### ✅ Example 2: Check Availability
```
Frontend: Admin clicks "Check Available Tables" on pending reservation
    ↓
Frontend: Sends GET /api/tables/availability/check?date=2026-05-13&time=19:00&guests=10
    ↓
Backend: tableController.checkTableAvailability()
    └─ Calls tableService.findBestTableCombination()
    ├─ Queries tables collection (isActive: true)
    ├─ Queries tableavailabilities collection (date, time, isBooked)
    ├─ Finds available tables matching guest count
    ├─ Smart algorithm: Single best fit or two-table combo
    └─ Returns recommended tables
    ↓
Frontend: Shows available tables in modal with "Approve" button
    ↓
MongoDB: Read-only queries (no data changed)
```

### ✅ Example 3: Approve & Assign Tables (THE CRITICAL FIX)
```
Frontend: Admin clicks "Approve" button
    ↓
Frontend: Sends PUT /admin/reservations/{id}/status
    { status: 'approved', adminResponse: '' }
    ↓
Backend: adminController.updateReservationStatus()
    ├─ STEP 1: Check if ANY tables exist
    │         SELECT COUNT(*) FROM tables WHERE isActive=true
    │         IF count=0 → REJECT with error "No tables configured"
    │
    ├─ STEP 2: Find best table combination
    │         CALL tableService.findBestTableCombination()
    │         IF no tables available → REJECT with error "No available tables"
    │
    └─ STEP 3: Assign tables (ATOMIC TRANSACTION)
              tableService.assignTablesToReservation(reservationId, tableIds)
              ├─ START TRANSACTION (MongoDB session)
              ├─ VALIDATE tables still available (race condition check)
              ├─ CREATE/UPDATE tableavailabilities records
              │  └─ isBooked: true, reservation: reservationId
              ├─ UPDATE reservations document
              │  ├─ assignedTables: [tableId1, tableId2]
              │  ├─ totalSeatsAssigned: 14
              │  └─ availabilityRecords: [availId1, availId2]
              ├─ COMMIT or ROLLBACK
              └─ Return updated reservation
    ↓
Frontend: Shows "✅ Reservation APPROVED! Tables assigned: P3, T7"
    ↓
AdminPortal: Updates reservations list, clears modal
    ↓
MongoDB Results:
    ├─ reservations collection: Added assignedTables[], totalSeatsAssigned, etc.
    ├─ tableavailabilities collection: Added 2 new records with isBooked: true
    └─ tables collection: Unchanged (just referenced)
```

### ✅ Example 4: View Seating History
```
Frontend: Admin clicks "📋 Seating History" tab
    ↓
Frontend: Sends GET /admin/seating-history?limit=100
    ↓
Backend: adminController.getSeatingHistory()
    ├─ Query: SELECT * FROM reservations WHERE status='approved' AND assignedTables != empty
    ├─ POPULATE user (name, email)
    ├─ POPULATE assignedTables (tableNumber, section, capacity)
    ├─ POPULATE reviewedBy (name, email)
    ├─ Sort by createdAt DESC
    ├─ Format response
    └─ Return array of seating records
    ↓
Frontend: Displays table with:
    ├─ Customer Name, Email
    ├─ Guest Count
    ├─ Assigned Tables (P3, T7)
    ├─ Approval Date
    ├─ Approved By (Admin name)
    └─ Special Requests
    ↓
MongoDB: Read-only queries with references populated
```

### ✅ Example 5: Reject & Release Tables
```
Frontend: Admin clicks "Reject" button
    ↓
Frontend: Sends PUT /admin/reservations/{id}/status
    { status: 'rejected', adminResponse: 'Date unavailable' }
    ↓
Backend: adminController.updateReservationStatus()
    ├─ IF status='rejected':
    │  └─ CALL tableService.releaseTablesFromReservation()
    │     ├─ Find all availabilityRecords for this reservation
    │     ├─ UPDATE tableavailabilities
    │     │  └─ isBooked: false, reservation: null
    │     └─ CLEAR from reservations:
    │        ├─ assignedTables: []
    │        ├─ totalSeatsAssigned: 0
    │        └─ availabilityRecords: []
    │
    └─ UPDATE reservations (status, adminResponse, reviewedBy, reviewedAt)
    ↓
Frontend: Shows "✅ Reservation REJECTED"
    ↓
AdminPortal: Updates reservations list
    ↓
MongoDB Results:
    ├─ reservations: status='rejected', cleared table assignments
    ├─ tableavailabilities: isBooked=false (tables now available again)
    └─ Same tables available for other reservations at same time
```

---

## Database Collections Summary

### Tables Collection
- **Total Records**: 15 (after seeding)
- **Total Capacity**: 64 seats
- **Sections**: Main Dining (8), Patio (3), Private Room (1), Bar (3)
- **Unique Field**: tableNumber (prevents duplicates)
- **Read**: On every availability check
- **Write**: On create/update/delete table, soft delete on deactivate

### TableAvailability Collection
- **Total Records**: Grows as reservations are approved
- **Keys**: (table, date, timeSlot) - Unique to prevent double-booking
- **Lifecycle**: 
  - Created when reservation approved
  - Marked isBooked:true
  - Marked isBooked:false when reservation rejected
  - Clean up old records periodically
- **Purpose**: Inventory management of time slots

### Reservations Collection
- **Total Records**: All reservations (pending, approved, rejected)
- **New Fields**: assignedTables[], totalSeatsAssigned, availabilityRecords[]
- **Read**: For listing all reservations, seating history
- **Write**: On create, on approval (add tables), on rejection (clear tables)
- **Populated References**: user, assignedTables, reviewedBy

---

## ⚠️ Critical Connection Points (Prevents the Loophole)

### The Loophole That's Fixed:
**Before**: Admin could approve without checking if free seats exist
**After**: System checks availability BEFORE approval happens

### Code Flow (Protection):
```
updateReservationStatus(status='approved')
    ↓
Count tables in system
    └─ IF 0 tables → REJECT ❌
    ↓
Find best table combination
    └─ IF no available → REJECT ❌
    ↓
Assign tables (transaction)
    └─ If any error → ROLLBACK ❌
    ↓
Only THEN update reservation to 'approved' ✅
```

### Database Constraints Enforcing This:
1. **Unique Index** on (table, date, timeSlot) in tableavailabilities
   - Prevents assigning same table to multiple reservations
2. **MongoDB Transactions** in assignTablesToReservation()
   - Ensures atomic all-or-nothing: Either fully assigned or fully rejected
3. **Reference Constraints** via Mongoose
   - Ensures assigned tables actually exist in tables collection

---

## 🎯 Current State: READY FOR TESTING

### ✅ What's Connected
- [x] All 3 models properly defined with references
- [x] All CRUD operations implemented
- [x] Smart availability checking with best-fit algorithm
- [x] Admin approval with table validation
- [x] Table rejection with table release
- [x] Seating history with audit trail
- [x] Frontend components fetching/displaying data
- [x] Seed script with 15 default tables

### 📋 What Needs Testing
- [ ] Seed 15 tables via POST /api/tables/seed or CLI
- [ ] Create test reservation from frontend
- [ ] Verify tables appear in TableManagement
- [ ] Check availability for pending reservation
- [ ] Approve and verify tables assigned in MongoDB
- [ ] View seating history audit trail
- [ ] Reject and verify tables released
- [ ] Test overlapping reservation blocking
- [ ] Create custom table and test assignment

### 🚀 Next Action
Execute: `POST /api/tables/seed` from AdminPortal or `node backend/src/data/seedTables.js` from CLI
