import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import { generateToken, verifyToken } from '../lib/jwt.js';

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

  try {
    await connectDB();
    const { action } = req.query;

    switch (action) {
      case 'register':
        return handleRegister(req, res);
      case 'login':
        return handleLogin(req, res);
      case 'me':
        return handleMe(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle user registration
async function handleRegister(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Create welcome notification (1 minute delay simulation)
    setTimeout(async () => {
      try {
        const welcomeNotification = new Notification({
          userId: user._id,
          title: 'Welcome to SERA! 🎉',
          message: `Hi ${user.name}! Welcome to SERA Food Delivery. Start exploring delicious food from the best restaurants in your area.`,
          type: 'registration',
          action: 'none'
        });
        await welcomeNotification.save();
      } catch (error) {
        console.error('Error creating welcome notification:', error);
      }
    }, 1000); // 1 second delay for demo

    // Create admin activity for new customer registration
    setTimeout(async () => {
      try {
        const adminActivity = new Activity({
          type: 'customer_registered',
          title: 'New Customer Registered',
          description: `New customer "${user.name}" (${user.email}) has registered on the platform.`,
          userId: user._id,
          targetRole: 'admin',
          metadata: {
            customerName: user.name,
            customerEmail: user.email,
            registrationTime: new Date()
          }
        });
        await adminActivity.save();
      } catch (error) {
        console.error('Error creating admin activity:', error);
      }
    }, 2000); // 2 second delay to ensure user is saved first
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Handle user login
async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Create wrong password notification
      try {
        const wrongPasswordNotification = new Notification({
          userId: user._id,
          title: 'Login Attempt Failed 🔒',
          message: `Failed login attempt detected at ${new Date().toLocaleString()}. If this wasn't you, please change your password immediately.`,
          type: 'security',
          action: 'none'
        });
        await wrongPasswordNotification.save();
      } catch (error) {
        console.error('Error creating wrong password notification:', error);
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Handle get current user
async function handleMe(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    const decoded = verifyToken(token);
    
    // Find user by ID
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
