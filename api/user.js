import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../lib/jwt.js';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  // Handle addresses without authentication for now (mock user)
  if (action === 'addresses' || action === 'add-address' || action === 'update-address' || action === 'delete-address') {
    return handleAddressesRequest(req, res);
  }

  try {
    await connectDB();

    // Authentication check for all other user operations
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    switch (action) {
      case 'profile':
        return handleProfile(req, res, decoded.userId);
      case 'update-profile':
        return handleUpdateProfile(req, res, decoded.userId);
      case 'complete-profile':
        return handleCompleteProfile(req, res, decoded.userId);
      case 'settings':
        return handleSettings(req, res, decoded.userId);
      case 'update-settings':
        return handleUpdateSettings(req, res, decoded.userId);
      case 'change-password':
        return handleChangePassword(req, res, decoded.userId);
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

// Complete user profile
async function handleCompleteProfile(req, res, userId) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      addresses,
      preferences,
      settings
    } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and phone number are required' 
      });
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid 10-digit phone number' 
      });
    }

    // Validate date of birth (must be at least 13 years old)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        return res.status(400).json({ 
          success: false, 
          message: 'You must be at least 13 years old to use this service' 
        });
      }
    }

    // Validate gender
    if (gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid gender selection' 
      });
    }

    // Validate dietary preferences
    if (preferences?.dietary && !['none', 'veg', 'non-veg', 'jain', 'vegan'].includes(preferences.dietary)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid dietary preference' 
      });
    }

    // Validate spice level
    if (preferences?.spiceLevel && !['mild', 'medium', 'hot'].includes(preferences.spiceLevel)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid spice level preference' 
      });
    }

    // Validate addresses
    if (addresses && Array.isArray(addresses)) {
      for (const address of addresses) {
        if (!address.street || !address.city || !address.state || !address.pincode) {
          return res.status(400).json({ 
            success: false, 
            message: 'All address fields (street, city, state, pincode) are required' 
          });
        }
      }
    }

    // Update user profile
    const updateData = {
      name,
      phone,
      isProfileComplete: true
    };

    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (addresses) updateData.addresses = addresses;
    if (preferences) updateData.preferences = preferences;
    if (settings) updateData.settings = settings;

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
      message: 'Profile completed successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Address management using separate collection
async function handleAddressesRequest(req, res) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // For now, we'll use a mock user ID since we don't have authentication set up
    const userId = 'mock-user-id';
    const { action } = req.query;

    switch (action) {
      case 'addresses':
        if (req.method !== 'GET') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }

        const addresses = await db.collection('addresses')
          .find({ userId })
          .sort({ isDefault: -1, createdAt: -1 })
          .toArray();
        
        res.status(200).json({
          success: true,
          data: { addresses }
        });
        break;

      case 'add-address':
        if (req.method !== 'POST') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }

        const { label, fullName, phone, address, city, state, pincode, isDefault, instructions } = req.body;

        // Validate required fields
        if (!label || !fullName || !phone || !address || !city || !state || !pincode) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
          });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
          await db.collection('addresses').updateMany(
            { userId },
            { $set: { isDefault: false } }
          );
        }

        const newAddress = {
          userId,
          label,
          fullName,
          phone,
          address,
          city,
          state,
          pincode,
          isDefault: isDefault || false,
          instructions: instructions || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await db.collection('addresses').insertOne(newAddress);
        newAddress._id = result.insertedId;

        res.status(201).json({
          success: true,
          data: { address: newAddress }
        });
        break;

      case 'update-address':
        if (req.method !== 'PUT') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }

        const { id, ...updateData } = req.body;
        
        console.log('Update address request:', { id, updateData, userId }); // Debug log

        if (!id) {
          return res.status(400).json({
            success: false,
            message: 'Address ID is required'
          });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid address ID format'
          });
        }

        // If this is set as default, unset other defaults
        if (updateData.isDefault) {
          await db.collection('addresses').updateMany(
            { userId },
            { $set: { isDefault: false } }
          );
        }

        // Check if address exists before updating
        const existingAddress = await db.collection('addresses').findOne({
          _id: new ObjectId(id),
          userId
        });
        
        console.log('Existing address found:', existingAddress ? 'Yes' : 'No'); // Debug log

        if (!existingAddress) {
          return res.status(404).json({
            success: false,
            message: 'Address not found'
          });
        }

        const updatedAddress = await db.collection('addresses').findOneAndUpdate(
          { _id: new ObjectId(id), userId },
          { 
            $set: { 
              ...updateData, 
              updatedAt: new Date() 
            } 
          },
          { returnDocument: 'after' }
        );

        console.log('Update result:', updatedAddress); // Debug log

        if (!updatedAddress.value) {
          return res.status(404).json({
            success: false,
            message: 'Address not found'
          });
        }

        res.status(200).json({
          success: true,
          data: { address: updatedAddress.value }
        });
        break;

      case 'delete-address':
        if (req.method !== 'DELETE') {
          return res.status(405).json({ success: false, message: 'Method not allowed' });
        }

        const { addressId } = req.query;

        if (!addressId) {
          return res.status(400).json({
            success: false,
            message: 'Address ID is required'
          });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(addressId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid address ID format'
          });
        }

        const deleteResult = await db.collection('addresses').deleteOne({
          _id: new ObjectId(addressId),
          userId
        });

        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message: 'Address not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Address deleted successfully'
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid address action'
        });
    }

    await client.close();
  } catch (error) {
    console.error('Address API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Change password
async function handleChangePassword(req, res, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password for comparison
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Create password change notification
    try {
      const passwordChangeNotification = new Notification({
        userId: user._id,
        title: 'Password Changed Successfully 🔒',
        message: `Your password was changed successfully at ${new Date().toLocaleString()}. If you didn't make this change, please contact support immediately.`,
        type: 'security',
        action: 'none'
      });
      await passwordChangeNotification.save();
    } catch (error) {
      console.error('Error creating password change notification:', error);
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
