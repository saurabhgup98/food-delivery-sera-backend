import User from '../../models/User.js';
import Notification from '../../models/Notification.js';

// Get user profile
export async function handleProfile(req, res, userId) {
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
export async function handleUpdateProfile(req, res, userId) {
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
export async function handleSettings(req, res, userId) {
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
export async function handleUpdateSettings(req, res, userId) {
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
export async function handleAddresses(req, res, userId) {
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
export async function handleAddAddress(req, res, userId) {
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
export async function handleDeleteAddress(req, res, userId) {
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
export async function handleCompleteProfile(req, res, userId) {
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

// Change password
export async function handleChangePassword(req, res, userId) {
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
