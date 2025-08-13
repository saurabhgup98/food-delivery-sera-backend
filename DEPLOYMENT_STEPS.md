# 🚀 Complete Deployment Guide - Food Delivery App

## 📋 **Prerequisites Checklist**
- [ ] Node.js installed (v18+)
- [ ] Git repository set up
- [ ] Vercel account created
- [ ] MongoDB Atlas account created

---

## **Step 1: MongoDB Atlas Setup** 🌐

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and sign up
3. Create a new project: "Food Delivery App"

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region close to you
5. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Username: `fooddeliveryuser`
3. Password: Create strong password (save it!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere"
3. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Replace `<dbname>` with `food-delivery`

**Example:**
```
mongodb+srv://fooddeliveryuser:YourPassword123@cluster0.xxxxx.mongodb.net/food-delivery
```

---

## **Step 2: Deploy Backend to Vercel** 🚀

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```
- Choose "Continue with GitHub" (or your preferred method)
- Complete authentication

### 2.3 Deploy Backend
```bash
cd food-delivery-app-backend
vercel
```

**Answer the questions:**
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `food-delivery-backend` (or press Enter)
- Directory: `./` (current directory)
- Override settings: `N`

### 2.4 Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

```
NODE_ENV=production
MONGODB_URI_PROD=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://your-frontend-vercel-url.vercel.app
```

### 2.5 Deploy to Production
```bash
vercel --prod
```

### 2.6 Get Your Backend URL
- Copy the production URL from Vercel dashboard
- Example: `https://food-delivery-backend-abc123.vercel.app`

---

## **Step 3: Update Frontend Configuration** ⚙️

### 3.1 Update API URL
1. Go to your frontend project
2. Create `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

**Example:**
```env
REACT_APP_API_URL=https://food-delivery-backend-abc123.vercel.app
```

### 3.2 Update CORS in Backend
1. Go back to Vercel dashboard
2. Update the `CORS_ORIGIN` environment variable with your frontend URL:

```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 3.3 Redeploy Frontend
1. Commit and push your changes
2. Vercel will automatically redeploy

---

## **Step 4: Test the Connection** 🧪

### 4.1 Test Backend Health
```bash
curl https://your-backend-url.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Food Delivery API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 4.2 Test Registration
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4.3 Test Login
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## **Step 5: Test Frontend Integration** 🎯

### 5.1 Open Your Frontend
1. Go to your frontend URL
2. Click "Login" or "Sign Up"
3. Try registering a new user
4. Try logging in with the registered user

### 5.2 Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for any API errors
- Check Network tab for API calls

---

## **Step 6: Troubleshooting** 🔧

### Common Issues:

#### 1. CORS Errors
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
- Update `CORS_ORIGIN` in Vercel environment variables
- Make sure it matches your frontend URL exactly

#### 2. Database Connection Failed
**Error:** `MongoDB URI is not defined in environment variables`

**Solution:**
- Check `MONGODB_URI_PROD` in Vercel environment variables
- Verify the connection string is correct
- Test the connection string in MongoDB Atlas

#### 3. JWT Errors
**Error:** `Invalid token` or `Token expired`

**Solution:**
- Check `JWT_SECRET` is set in Vercel environment variables
- Make sure it's a strong, unique secret

#### 4. Frontend Can't Connect
**Error:** `Failed to fetch` or network errors

**Solution:**
- Verify `REACT_APP_API_URL` in frontend `.env` file
- Check if backend URL is accessible
- Ensure CORS is properly configured

---

## **Step 7: Success Checklist** ✅

- [ ] MongoDB Atlas cluster is running
- [ ] Backend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] Frontend updated with backend URL
- [ ] Registration works from frontend
- [ ] Login works from frontend
- [ ] User stays logged in after refresh
- [ ] Logout works correctly

---

## **🎉 Congratulations!**

Your food delivery app is now fully deployed and connected! Users can:
- Register new accounts
- Login with existing accounts
- Stay logged in across sessions
- Access protected routes

---

## **Next Steps** 🚀

1. **Add More Features:**
   - Restaurant listings
   - Menu management
   - Order processing
   - Payment integration

2. **Enhance Security:**
   - Email verification
   - Password reset
   - Two-factor authentication

3. **Improve Performance:**
   - Add caching
   - Optimize database queries
   - Implement CDN

4. **Monitor & Maintain:**
   - Set up logging
   - Monitor performance
   - Regular backups

---

**Need Help?** 
- Check the console for errors
- Verify all environment variables
- Test API endpoints directly
- Check Vercel and MongoDB Atlas logs
