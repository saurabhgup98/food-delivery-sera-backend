/**
 * User Handlers Module
 * Contains all user profile and settings handler functions
 */

import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import { validateProfileUpdate, validateCompleteProfile, validatePasswordChange } from './userValidation.js';
import { buildUpdateData, createNotification, formatUserResponse, handleDatabaseError, createPasswordChangeNotification } from './userHelpers.js';

// Profile handlers
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
      data: { user: formatUserResponse(user) }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function handleUpdateProfile(req, res, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, avatar } = req.body;
    
    // Validate input
    const validation = validateProfileUpdate({ name, email, phone, avatar });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: validation.error });
    }
    
    const updateData = buildUpdateData({ name, email, phone, avatar });
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
      data: { user: formatUserResponse(user) }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    const errorResponse = handleDatabaseError(error);
    res.status(500).json(errorResponse);
  }
}

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

    // Validate input
    const validation = validateCompleteProfile({ name, phone, dateOfBirth, gender, addresses, preferences });
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: validation.error 
      });
    }

    // Update user profile
    const updateData = buildUpdateData({
      name,
      phone,
      dateOfBirth,
      gender,
      addresses,
      preferences,
      settings,
      isProfileComplete: true
    });

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
      data: { user: formatUserResponse(user) }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    const errorResponse = handleDatabaseError(error);
    res.status(500).json(errorResponse);
  }
}

// Settings handlers
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

export async function handleChangePassword(req, res, userId) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    const validation = validatePasswordChange({ currentPassword, newPassword });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error
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
    await createPasswordChangeNotification(userId);

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
