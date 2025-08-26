# Bella Vista Restaurant Website

A modern, responsive restaurant website built with React.js, Node.js, Express, MongoDB Atlas, and CSS with user authentication.

## 🚀 Features

- **User Authentication**: Secure login/signup system with JWT tokens
- **Protected Reservations**: Users must login to make table reservations
- **MongoDB Atlas**: All user data and reservations stored in cloud database
- **Modern Design**: Clean, elegant interface with responsive design
- **Interactive Menu**: Dynamic menu with categories (Appetizers, Mains, Desserts)
- **Online Reservations**: Table booking system with form validation (requires login)
- **Contact System**: Contact form with email notifications
- **About Page**: Restaurant story, team, and values
- **Mobile Responsive**: Optimized for all device sizes

## 📁 Project Structure

```
resturant/
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── email.js       # Email configuration
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/       # Route controllers
│   │   │   ├── menuController.js
│   │   │   ├── reservationController.js
│   │   │   └── contactController.js
│   │   ├── models/            # MongoDB models
│   │   │   ├── User.js        # User model
│   │   │   └── Reservation.js # Reservation model
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── auth.js        # JWT authentication
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── data/              # Data files
│   │   │   └── menuData.js    # Menu items data
│   │   └── routes/            # API routes
│   │       ├── index.js       # Main router
│   │       ├── authRoutes.js  # Authentication routes
│   │       ├── menuRoutes.js
│   │       ├── reservationRoutes.js
│   │       └── contactRoutes.js
│   ├── app.js                 # Main server file
│   ├── package.json
│   └── .env                   # Environment variables
│
└── frontend/                  # React.js Frontend
    ├── src/
    │   ├── components/        # React components
    │   │   ├── Navbar.js & .css
    │   │   ├── Home.js & .css
    │   │   ├── Menu.js & .css
    │   │   ├── About.js & .css
    │   │   ├── Reservations.js & .css
    │   │   ├── Contact.js & .css
    │   │   ├── Login.js & .css
    │   │   ├── Signup.js & .css
    │   │   └── Footer.js & .css
    │   ├── App.js             # Main App component
    │   └── App.css            # Global styles
    └── package.json
```

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB Atlas**: Cloud database for user data and reservations
- **Mongoose**: MongoDB object modeling
- **JWT (JSON Web Tokens)**: User authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Nodemailer**: Email functionality
- **Nodemon**: Development auto-restart

### Frontend
- **React.js**: UI library
- **React Router**: Navigation and protected routes
- **Axios**: HTTP client with authentication headers
- **CSS3**: Styling with CSS variables and Grid/Flexbox

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resturant
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user
   - Get your connection string
   - Update `backend/.env` with your MongoDB URI

5. **Configure Environment Variables**
   Update `backend/.env` file:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/restaurant?retryWrites=true&w=majority
   JWT_SECRET=your_very_secure_jwt_secret_key
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: http://localhost:3000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: http://localhost:3001 (or next available port)

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category
- `GET /api/menu/item/:id` - Get specific menu item

### Reservations (Protected - Requires Authentication)
- `POST /api/reservation` - Create a reservation (JWT required)
- `GET /api/reservation/:id` - Get reservation details (JWT required)

### Contact
- `POST /api/contact` - Send contact message
- `GET /api/contact` - Get contact messages (admin)

### Health Check
- `GET /api/health` - API health status

## 🎨 Design Features

- **Color Scheme**: Warm browns and oranges for restaurant ambiance
- **Typography**: Georgia serif font for elegance
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth hover effects and transitions
- **Icons**: Emoji icons for visual appeal

## 📧 Email Configuration

To enable email functionality:

1. Update `backend/.env` file:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   RESTAURANT_EMAIL=restaurant@bellavista.com
   ```

2. Uncomment email configuration in `src/config/email.js`

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RESTAURANT_EMAIL=restaurant@bellavista.com
FRONTEND_URL=http://localhost:3001
```

## 📱 Pages

1. **Home**: Hero section, features, about preview, menu highlights
2. **Menu**: Complete menu with categories and search
3. **About**: Restaurant story, team, values, awards
4. **Reservations**: Online booking form with validation
5. **Contact**: Contact form and restaurant information

## 🚀 Deployment

### Backend
- Deploy to services like Heroku, Railway, or DigitalOcean
- Set environment variables in hosting platform
- Update CORS settings for production domain

### Frontend
- Deploy to Netlify, Vercel, or similar
- Update API endpoints to production URLs
- Build for production: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🍽️ About Bella Vista

Bella Vista is a fictional Italian restaurant showcasing modern web development practices for the hospitality industry. This project demonstrates full-stack development with React and Node.js.
