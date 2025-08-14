import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import { verifyToken } from '../lib/jwt.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // Authentication check for all user operations
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const { action } = req.query;

    switch (action) {
      case 'profile':
        return handleProfile(req, res, decoded.userId);
      case 'update-profile':
        return handleUpdateProfile(req, res, decoded.userId);
      case 'settings':
        return handleSettings(req, res, decoded.userId);
      case 'update-settings':
        return handleUpdateSettings(req, res, decoded.userId);
      case 'addresses':
        return handleAddresses(req, res, decoded.userId);
      case 'add-address':
        return handleAddAddress(req, res, decoded.userId);
      case 'delete-address':
        return handleDeleteAddress(req, res, decoded.userId);
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get user profile
async function handleProfile(req, res, userId) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Update user profile
async function handleUpdateProfile(req, res, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get user settings
async function handleSettings(req, res, userId) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const user = await User.findById(userId).select('settings');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Settings retrieved successfully',
      data: { settings: user.settings || {} }
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Update user settings
async function handleUpdateSettings(req, res, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { settings } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { settings },
      { new: true, runValidators: true }
    ).select('settings');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings: user.settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get user addresses
async function handleAddresses(req, res, userId) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: { addresses: user.addresses || [] }
    });
  } catch (error) {
    console.error('Addresses error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Add user address
async function handleAddAddress(req, res, userId) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Address added successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Delete user address
async function handleDeleteAddress(req, res, userId) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { addressId } = req.query;
    
    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Address ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true, runValidators: true }
    ).select('addresses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: { addresses: user.addresses }
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
