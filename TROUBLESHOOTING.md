# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### 1. **MongoDB Connection Error**
**Error:** `MONGODB_URI is not defined in environment variables` or `MongoDB connection error`

**Solution:**
- Check that `.env` file exists in the `backend` folder
- Verify `MONGODB_URI` is set correctly in `.env`
- Format: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant?retryWrites=true&w=majority`
- Make sure there are no spaces around the `=` sign
- Ensure your MongoDB Atlas cluster is running and accessible

### 2. **JWT_SECRET Error**
**Error:** `JWT_SECRET is not defined` or authentication fails

**Solution:**
- Add `JWT_SECRET=your_secret_key_here` to your `.env` file
- Use a long, random string (at least 32 characters)
- Example: `JWT_SECRET=my_super_secret_jwt_key_12345`

### 3. **Port Already in Use**
**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
- Stop any other process using port 3000
- Or change the port in `.env`: `PORT=3001`
- On Windows, find and kill the process:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### 4. **Module Not Found**
**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
cd backend
npm install
```

### 5. **Frontend Connection Error**
**Error:** Frontend can't connect to backend API

**Solution:**
- Make sure backend is running on port 3000
- Check `FRONTEND_URL` in backend `.env` matches frontend port
- Verify CORS settings in `backend/app.js`

### 6. **Email Configuration Error**
**Error:** Email sending fails (but this is optional)

**Solution:**
- Email is optional - the app will work without it
- Emails will be logged to console if not configured
- To enable emails, add to `.env`:
  ```
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_app_password
  ```

## Quick Checklist

Before running, ensure:
- ✅ `.env` file exists in `backend` folder
- ✅ `MONGODB_URI` is set and valid
- ✅ `JWT_SECRET` is set
- ✅ Dependencies installed: `npm install` in both `backend` and `frontend`
- ✅ MongoDB Atlas cluster is accessible
- ✅ Ports 3000 and 3001 are available

## Testing Your Setup

1. **Test Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `✅ Connected to MongoDB Atlas` and `🚀 Server running on port 3000`

2. **Test Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Should open browser at `http://localhost:3001`

## Still Having Issues?

Share the exact error message you're seeing, and I can help troubleshoot!

