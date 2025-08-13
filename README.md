# 🍕 Food Delivery Backend API

A robust Node.js backend API for food delivery applications, built with TypeScript, Express, MongoDB, and designed for Vercel deployment.

## 🚀 Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Role-based access control
  - Password hashing with bcrypt

- **👥 User Management**
  - User profiles with preferences
  - Multiple delivery addresses
  - Dietary restrictions and allergies

- **🏪 Restaurant Management**
  - Restaurant CRUD operations
  - Menu management
  - Real-time status updates

- **🛒 Order Management**
  - Shopping cart functionality
  - Order processing and tracking
  - Payment integration

- **🔒 Security**
  - Input validation and sanitization
  - Rate limiting
  - CORS protection
  - Helmet security headers

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: Vercel (Serverless)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd food-delivery-app-backend
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env
```

Update `.env` with your configuration:

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

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Recommended for Production)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI_PROD` in your environment variables

### 4. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Users (Coming Soon)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Restaurants (Coming Soon)
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Menu (Coming Soon)
- `GET /api/menu` - Get menu items
- `GET /api/menu/:id` - Get menu item by ID
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
npm run format      # Format code with Prettier

# Testing
npm test            # Run tests
```

## 🚀 Deployment to Vercel

### 1. Prepare for Deployment

The project is already configured for Vercel deployment with:
- `vercel.json` configuration
- TypeScript build setup
- Environment variable handling

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### 3. Environment Variables on Vercel

Set these environment variables in your Vercel dashboard:

```env
NODE_ENV=production
MONGODB_URI_PROD=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-frontend-domain.com
```

### 4. Custom Domain (Optional)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain

## 🧪 Testing the API

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

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   └── authController.ts    # Authentication logic
├── middleware/
│   ├── auth.ts             # JWT authentication
│   ├── errorHandler.ts     # Error handling
│   ├── notFound.ts         # 404 handler
│   └── validation.ts       # Input validation
├── models/
│   └── User.ts             # User model
├── routes/
│   ├── auth.ts             # Auth routes
│   ├── users.ts            # User routes
│   ├── restaurants.ts      # Restaurant routes
│   ├── menu.ts             # Menu routes
│   └── orders.ts           # Order routes
├── types/
│   └── index.ts            # TypeScript interfaces
└── index.ts                # Main application file
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin requests
- **Security Headers**: Helmet for additional security
- **Error Handling**: Comprehensive error management

## 🚧 Vercel Limitations & Solutions

### Limitations:
- **Execution Time**: 10 seconds (Hobby), 60 seconds (Pro)
- **File System**: Read-only, no persistent storage
- **Background Jobs**: No long-running processes
- **WebSocket**: Not supported in serverless functions

### Solutions:
- **Database**: Use MongoDB Atlas (cloud)
- **File Uploads**: Use Cloudinary or AWS S3
- **Real-time**: Use external services (Pusher, Socket.io)
- **Background Jobs**: Use external services (Cron-job.org)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Happy Coding! 🚀**
