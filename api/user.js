/**
 * User API Handler - Main Serverless Function
 * Handles all user-related operations including profile, settings, and addresses
 */

import connectDB from '../lib/mongodb.js';
import { verifyToken } from '../lib/jwt.js';
import { 
  handleProfile, 
  handleUpdateProfile, 
  handleCompleteProfile,
  handleSettings,
  handleUpdateSettings,
  handleChangePassword
} from './lib/userHandlers.js';
import { handleAddressesRequest } from './lib/addressHandlers.js';

export default async function handler(req, res) {
  // CORS setup
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

    // Route to appropriate handlers based on action
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