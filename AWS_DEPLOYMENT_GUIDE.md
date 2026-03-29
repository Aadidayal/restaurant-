# AWS S3 Deployment Guide

## ✅ Backend Changes Completed

Your backend (`app.js`) has been updated to accept requests from:
- ✓ Local development (localhost:3000, localhost:3001)
- ✓ AWS S3 Static Website domain
- ✓ Custom domain (via environment variable)

## 🚀 Deployment Steps

### **Step 1: Build Your React Frontend**

```bash
cd frontend
npm run build
```

This creates a `build/` folder with optimized production files.

---

### **Step 2: Get Your S3 Bucket URL**

After creating the S3 bucket in AWS console, your website URL will be:
```
http://restaurant-website-yourname.s3-website-us-east-1.amazonaws.com
```
(Replace the bucket name and region with your actual values)

---

### **Step 3: Update Environment Variables**

#### **Frontend Configuration** (`frontend/.env.production`)
```
REACT_APP_API_URL=http://your-backend-url-here:5000
REACT_APP_API_ENDPOINT=http://your-backend-url-here:5000/api
```

**Example:**
```
REACT_APP_API_URL=http://your-ec2-instance.com:5000
REACT_APP_API_ENDPOINT=http://your-ec2-instance.com:5000/api
```

#### **Backend Configuration** (`backend/.env`)
```
FRONTEND_URL=http://localhost:3001
PRODUCTION_FRONTEND_URL=http://restaurant-website-yourname.s3-website-us-east-1.amazonaws.com
```

---

### **Step 4: Upload to S3**

**Option A: AWS Console (Manual)**
1. Go to S3 console
2. Click your bucket
3. Upload all files from `frontend/build/` folder

**Option B: AWS CLI (Automated)**
```bash
aws s3 sync frontend/build s3://restaurant-website-yourname --delete
```

---

### **Step 5: Test It**

Visit your S3 website URL:
```
http://restaurant-website-yourname.s3-website-us-east-1.amazonaws.com
```

---

## 📝 All Components Updated

The following React components now support environment variables:
- ✓ Contact.js - Uses `API_ENDPOINT` for contact form
- ✓ Login.js - Uses `API_ENDPOINT` for authentication
- ✓ Signup.js - Uses `API_ENDPOINT` for user registration
- ✓ Menu.js - Uses `API_ENDPOINT` to fetch menu
- ✓ Reservations.js - Uses `API_ENDPOINT` for booking
- ✓ MyReservations.js - Uses `API_ENDPOINT` to fetch user reservations
- ✓ AdminPortal.js - Uses `API_ENDPOINT` for admin operations

---

## 🔄 CORS Configuration

Your backend now accepts requests from:
```javascript
// backend/app.js
app.use(cors({
  origin: [
    'http://localhost:3001',           // Development
    'http://localhost:3000',           // Development
    'http://restaurant-website-yourname.s3-website-us-east-1.amazonaws.com',  // Production S3
    process.env.PRODUCTION_FRONTEND_URL   // Custom domain (future)
  ],
  credentials: true
}));
```

---

## ⚠️ Important Notes

1. **Backend Still Required**: Your React frontend needs a running backend API
   - Can run locally on your computer during development
   - Should be deployed to EC2, Render, Vercel, or similar service for production

2. **API URL**: Update `REACT_APP_API_ENDPOINT` in `.env.production` to your backend URL

3. **Rebuild Required**: After changing `.env.production`, rebuild with:
   ```bash
   npm run build
   ```

4. **CORS**: If you get CORS errors, add your domain to the `origin` array in `backend/app.js`

---

## 📚 What's Your Next Step?

1. **Backend Hosting**: Where will your Node.js API run? (EC2, Render, Heroku, etc.)
2. **Custom Domain**: Do you want to use a custom domain instead of S3 URL?
3. **Database**: Is your MongoDB Atlas already set up?

Let me know! 🚀
