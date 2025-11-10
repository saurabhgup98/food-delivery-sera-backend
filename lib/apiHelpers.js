/**
 * Generic API helpers for all endpoints
 * Handles local request detection and DB connection for production
 */

import connectDB from './mongodb.js';
import { isLocalRequest as checkLocalRequest } from './requestUtils.js';

/**
 * Check if request is from localhost/local network
 * @param {Object} req - Express request object
 * @returns {boolean} - True if request is from local network
 */
export function isLocalRequest(req) {
  return checkLocalRequest(req);
}

/**
 * Connect to database (only for production requests)
 * @returns {Promise<void>}
 */
export async function connectToDB() {
  await connectDB();
}

/**
 * Set CORS headers for API response
 * @param {Object} res - Express response object
 */
export function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Handle preflight OPTIONS request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} - True if request was handled
 */
export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Validate HTTP method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string|string[]} allowedMethods - Allowed HTTP methods
 * @returns {boolean} - True if method is allowed
 */
export function validateMethod(req, res, allowedMethods = ['GET']) {
  const methods = Array.isArray(allowedMethods) ? allowedMethods : [allowedMethods];
  
  if (!methods.includes(req.method)) {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
    return false;
  }
  return true;
}

/**
 * Handle API errors with appropriate status codes
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {string} defaultMessage - Default error message
 */
export function handleError(error, res, defaultMessage = 'Internal server error') {
  console.error('API error:', error);
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (error.message === 'Database connection failed') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed'
    });
  }
  
  res.status(500).json({
    success: false,
    message: defaultMessage
  });
}