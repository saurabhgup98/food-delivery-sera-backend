# 🚀 Deployment Guide - Food Delivery Backend

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB Atlas** account (free tier available)
3. **Vercel** account (free tier available)
4. **Git** repository

## 🔧 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/food-delivery
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/food-delivery

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Security
BCRYPT_ROUNDS=12
```

### 3. Start Development Server
```bash
npm run dev
```

## 🌐 MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Configure Database Access
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password
4. Select "Read and write to any database"
5. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `food-delivery`

## 🚀 Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Set Environment Variables
In your Vercel dashboard:
1. Go to your project
2. Click "Settings"
3. Go to "Environment Variables"
4. Add the following variables:

```env
NODE_ENV=production
MONGODB_URI_PROD=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Deploy to Production
```bash
vercel --prod
```

## 🧪 Testing the Deployment

### 1. Health Check
```bash
curl https://your-vercel-app.vercel.app/health
```

### 2. Register a User
```bash
curl -X POST https://your-vercel-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "9876543210"
  }'
```

### 3. Login
```bash
curl -X POST https://your-vercel-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get User Profile (with token)
```bash
curl -X GET https://your-vercel-app.vercel.app/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Health Check
- `GET /health` - Server health status

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   - Check TypeScript compilation: `npm run build`
   - Ensure all dependencies are installed: `npm install`

2. **Database Connection Fails**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **CORS Errors**
   - Update `CORS_ORIGIN` in environment variables
   - Ensure frontend domain is correct

4. **JWT Errors**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings

### Debug Commands

```bash
# Check build
npm run build

# Check linting
npm run lint

# Format code
npm run format

# Test locally
npm run dev
```

## 📊 Monitoring

### Vercel Analytics
- Function execution time
- Request count
- Error rates
- Cold start performance

### MongoDB Atlas
- Database performance
- Connection count
- Storage usage
- Query performance

## 🔒 Security Checklist

- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] Password hashing is configured
- [ ] Environment variables are secure
- [ ] Database access is restricted

## 📈 Performance Optimization

### Vercel Optimizations
- Use connection pooling for MongoDB
- Implement caching where appropriate
- Optimize bundle size
- Use edge functions for global performance

### Database Optimizations
- Create proper indexes
- Use aggregation pipelines efficiently
- Implement pagination
- Monitor slow queries

---

**Happy Deploying! 🚀**
