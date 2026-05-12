# JavaScript Guide for Your Restaurant Project

## Core JavaScript Concepts Used in Your Project

---

## 1. VARIABLES & DATA TYPES

```javascript
// Variables (let is preferred)
let name = "John";           // String
let guests = 4;              // Number
let isApproved = true;       // Boolean
let data = null;             // No value
let reservation = undefined; // Declared but no value

// Objects (Key-Value pairs) - VERY IMPORTANT!
let user = {
  name: "John",
  email: "john@gmail.com",
  phone: "1234567890",
  guests: 4
};

// Access object properties
console.log(user.name);        // "John"
console.log(user["email"]);    // "john@gmail.com"

// Arrays (Lists)
let guests_list = [1, 2, 3, 4, 5];
let users = [];  // Empty array
console.log(guests_list[0]); // 1 (first item)
```

---

## 2. FUNCTIONS (Used everywhere in your project!)

```javascript
// Basic function
function addGuests(num1, num2) {
  return num1 + num2;
}

// Arrow function (Modern JavaScript - Used in React)
const addGuests = (num1, num2) => {
  return num1 + num2;
};

// Shorter arrow function
const addGuests = (num1, num2) => num1 + num2;

// Function with no parameters
const getCurrentTime = () => {
  return new Date();
};

// Using functions
let total = addGuests(5, 3); // Returns 8
```

**From your project:**
```javascript
// adminController.js - Function that gets all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## 3. ASYNC / AWAIT (Database operations)

This is CRITICAL for your backend!

```javascript
// Regular function
function getData() {
  // Does something, then returns
}

// Async function (waits for database)
async function getUsers() {
  try {
    const users = await User.find({});    // Wait for database
    console.log(users);                    // Then do this
    return users;
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// The "await" keyword pauses until the database responds
// Think: await = "Wait for database to answer before continuing"
```

**Simple Example:**
```javascript
// Without await - WRONG! (doesn't wait)
const user = User.find({});
console.log(user); // Won't show data!

// With await - CORRECT! (waits for database)
const user = await User.find({});
console.log(user); // Shows data!
```

---

## 4. TRY-CATCH (Error Handling)

Used in every backend function:

```javascript
try {
  // Code that might fail
  const user = await User.find({});
  res.json({ success: true, user: user });
} catch (error) {
  // If something fails, catch it here
  res.status(500).json({ 
    success: false, 
    error: error.message 
  });
}

// From your project example:
try {
  const reservations = await Reservation.find({});
  res.json({ success: true, reservations: reservations });
} catch (error) {
  res.status(500).json({ success: false, message: 'Error fetching reservations' });
}
```

---

## 5. ARRAY METHODS (Very useful!)

```javascript
let numbers = [1, 2, 3, 4, 5];
let reservations = [
  { name: "John", guests: 4 },
  { name: "Sarah", guests: 2 }
];

// map() - Transform each item
let doubled = numbers.map(num => num * 2);  // [2, 4, 6, 8, 10]
let names = reservations.map(r => r.name);  // ["John", "Sarah"]

// filter() - Keep only items that match
let big_reservations = reservations.filter(r => r.guests > 2); // [John's]
let large_numbers = numbers.filter(n => n > 3); // [4, 5]

// find() - Get first item that matches
let johns = reservations.find(r => r.name === "John"); // John's reservation

// forEach() - Do something for each item
reservations.forEach(r => {
  console.log(r.name); // John, then Sarah
});
```

---

## 6. OBJECT METHODS & ES6 SYNTAX

```javascript
// Creating objects
let reservation = {
  name: "John",
  email: "john@gmail.com",
  guests: 4
};

// Destructuring (Shortcut!)
const { name, email, guests } = reservation;
console.log(name);   // "John" (without typing reservation.name)

// Spread operator (...)
let reservation2 = { ...reservation, guests: 6 }; // Copy and change guests

// Template literals (with backticks)
console.log(`Hello ${name}! You have ${guests} guests`);
// Output: "Hello John! You have 4 guests"
```

---

## 7. REQUIRE & EXPORT (Importing code)

**Backend - Exporting (app.js exporting functions):**
```javascript
// File: services/notificationService.js
const sendEmail = (email) => {
  // Send email code
};

module.exports = { sendEmail };  // Export to use elsewhere
```

**Backend - Importing (Use in another file):**
```javascript
// File: adminController.js
const { sendEmail } = require('../services/notificationService');
// Now can use: sendEmail(email)
```

**Frontend - Using import/export:**
```javascript
// Export
export const Home = () => { ... };

// Import
import { Home } from './components/Home';
```

---

## 8. REACT BASICS (Frontend)

```javascript
// Functional Component (Like a function that returns HTML)
const Home = () => {
  const name = "John";
  
  return (
    <div>
      <h1>Welcome {name}!</h1>
      <button onClick={() => alert("Clicked!")}>Click me</button>
    </div>
  );
};

// JSX (HTML-like syntax in JavaScript)
<div className="card">          {/* CSS class */}
  <h2>{title}</h2>              {/* Display variable */}
  <p>{description}</p>
</div>
```

---

## 9. COMMON PATTERNS IN YOUR PROJECT

### Backend Pattern (Controllers):
```javascript
// Step 1: Get request data
// Step 2: Query database (with await)
// Step 3: Send response back as JSON

const getReservations = async (req, res) => {
  try {
    // 1. Get data from request
    const userId = req.user.userId;
    
    // 2. Query database
    const reservations = await Reservation.find({ user: userId });
    
    // 3. Send response
    res.json({ 
      success: true, 
      count: reservations.length,
      reservations: reservations 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Frontend Pattern (Components):
```javascript
// Step 1: Define component (function)
// Step 2: Fetch data from backend
// Step 3: Display/Render on page

const MyReservations = () => {
  // Display reservations here
  
  return (
    <div>
      <h1>My Reservations</h1>
      {/* Show list of reservations */}
    </div>
  );
};
```

---

## 10. MONGOOSE BASICS (Database models)

```javascript
// From your Reservation.js model:
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  guests: Number,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);

// Usage in controller:
const reservation = await Reservation.find({});        // Get all
const one = await Reservation.findById(id);            // Get by ID
const filtered = await Reservation.find({ status: 'pending' }); // Filter
const updated = await Reservation.updateOne({ _id: id }, { status: 'approved' });
const deleted = await Reservation.deleteOne({ _id: id });
```

---

## 11. API CALLS (Frontend calling Backend)

```javascript
// Basic fetch (GET)
const getReservations = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/reservations');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
};

// POST (Send data to backend)
const createReservation = async (reservationData) => {
  try {
    const response = await fetch('http://localhost:3000/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};
```

---

## QUICK CHEAT SHEET

```javascript
// Variables
let, const, var

// Basic operations
+, -, *, /, %, ==, ===, !==, >, <, &&, ||

// Conditionals
if (condition) { } else { }
condition ? true_value : false_value

// Loops
for (let i = 0; i < 10; i++) { }
while (condition) { }
array.forEach(item => { })

// Objects & Arrays
let obj = { key: 'value' };
let arr = [1, 2, 3];

// Functions
const func = () => { };
async function asyncFunc() { };
await somePromise;

// Error handling
try { } catch (error) { }

// Database
await Model.find({});
await Model.findById(id);
await Model.updateOne({}, { field: value });
await Model.deleteOne({});
```

---

## KEY FILES TO UNDERSTAND

1. **Backend Controllers** (`backend/src/controllers/*.js`)
   - Functions that handle requests
   - Always use try-catch
   - Always use async/await for database

2. **Models** (`backend/src/models/*.js`)
   - Database schema definition
   - Defines what fields exist

3. **Routes** (`backend/src/routes/*.js`)
   - URL mapping (which function handles which URL)

4. **Frontend Components** (`frontend/src/components/*.js`)
   - React functions that return HTML
   - Calls backend APIs

---

**Good luck! Study these 11 concepts and you can write basic code for this project.**
