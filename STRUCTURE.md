# Project File Structure - Clean & Organized

## 📁 Complete Project Structure

```
resturant/
├── README.md                           # Project documentation
├── .git/                              # Git repository
│
├── backend/                           # Node.js Backend (Port 3000)
│   ├── .env                          # Environment variables
│   ├── package.json                  # Backend dependencies
│   ├── app.js                        # Main server file (NEW)
│   └── src/                          # Organized source code
│       ├── config/
│       │   └── email.js              # Email configuration
│       ├── controllers/              # Business logic
│       │   ├── contactController.js
│       │   ├── menuController.js
│       │   └── reservationController.js
│       ├── data/
│       │   └── menuData.js           # Menu items data
│       ├── middleware/
│       │   ├── errorHandler.js       # Error handling
│       │   └── logger.js             # Request logging
│       └── routes/
│           ├── index.js              # Main router
│           ├── contactRoutes.js
│           ├── menuRoutes.js
│           └── reservationRoutes.js
│
└── frontend/                         # React.js Frontend
    ├── package.json                  # Frontend dependencies
    └── src/
        ├── App.js                    # Main App with routing
        ├── App.css                   # Global styles
        ├── index.js                  # React entry point
        ├── reportWebVitals.js        # Performance monitoring
        └── components/               # React components
            ├── About.js & About.css
            ├── Contact.js & Contact.css
            ├── Footer.js & Footer.css
            ├── Home.js & Home.css
            ├── Menu.js & Menu.css
            ├── Navbar.js & Navbar.css
            └── Reservations.js & Reservations.css
```

## 🧹 Files Removed (Duplicates & Unused)



- ✅ No duplicate files
- ✅ Organized backend (MVC pattern)
- ✅ Component-based frontend
- ✅ Easy to understand and maintain
- ✅ Ready for development and deployment

The project is now optimized and ready to run! 🍽️
```
