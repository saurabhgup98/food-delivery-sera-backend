/**
 * User Helper Functions Module
 * Contains utility functions for user-related operations
 */

import Notification from '../../models/Notification.js';

export function buildUpdateData(fields) {
  const updateData = {};
  const { name, email, phone, avatar, dateOfBirth, gender, addresses, preferences, settings } = fields;
  
  if (name) updateData.name = name;
  if (email) updateData.email = email.toLowerCase();
  if (phone) updateData.phone = phone;
  if (avatar) updateData.avatar = avatar;
  if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
  if (gender) updateData.gender = gender;
  if (addresses) updateData.addresses = addresses;
  if (preferences) updateData.preferences = preferences;
  if (settings) updateData.settings = settings;
  
  return updateData;
}

export async function createNotification(userId, title, message, type = 'general') {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      action: 'none'
    });
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export function formatUserResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    addresses: user.addresses,
    preferences: user.preferences,
    settings: user.settings,
    isProfileComplete: user.isProfileComplete,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function handleDatabaseError(error) {
  if (error.code === 11000) {
    return { success: false, message: 'User with this email already exists' };
  }
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return { success: false, message: errors.join(', ') };
  }
  
  if (error.name === 'CastError') {
    return { success: false, message: 'Invalid ID format' };
  }
  
  return { success: false, message: 'Internal server error' };
}

export function createPasswordChangeNotification(userId) {
  return createNotification(
    userId,
    'Password Changed Successfully 🔒',
    `Your password was changed successfully at ${new Date().toLocaleString()}. If you didn't make this change, please contact support immediately.`,
    'security'
  );
}

export function createWelcomeNotification(userId, userName) {
  return createNotification(
    userId,
    'Welcome to SERA! 🎉',
    `Hi ${userName}! Welcome to SERA Food Delivery. Start exploring delicious food from the best restaurants in your area.`,
    'registration'
  );
}

export function createWrongPasswordNotification(userId) {
  return createNotification(
    userId,
    'Login Attempt Failed 🔒',
    `Failed login attempt detected at ${new Date().toLocaleString()}. If this wasn't you, please change your password immediately.`,
    'security'
  );
}
