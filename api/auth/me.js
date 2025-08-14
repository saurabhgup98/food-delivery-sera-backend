import connectDB from '../../lib/mongodb.js';
import User from '../../models/User.js';
import { verifyToken } from '../../lib/jwt.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Connect to database
    await connectDB();
    
    // Get authorization header
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    // Verify JWT token
    console.log('Verifying JWT token...');
    const decoded = verifyToken(token);
    console.log('Token decoded successfully, userId:', decoded.userId);
    
    // Find user by ID
    console.log('Finding user by ID:', decoded.userId);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          addresses: user.addresses,
          preferences: user.preferences
        }
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.message === 'Invalid token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
