import connectDB from '../lib/mongodb.js';
import Notification from '../models/Notification.js';
import PromoCode from '../models/PromoCode.js';
import User from '../models/User.js';

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

    const { action } = req.query;

    switch (action) {
      case 'contact':
        return handleContact(req, res);
      case 'support':
        return handleSupport(req, res);
      case 'feedback':
        return handleFeedback(req, res);
      case 'app-info':
        return handleAppInfo(req, res);
      case 'notifications':
        return handleNotifications(req, res);
      case 'promotions':
        return handlePromotions(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

  } catch (error) {
    console.error('App API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle contact form submissions
async function handleContact(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Here you would typically save to database or send email
    // For now, we'll just return success
    console.log('Contact form submission:', { name, email, subject, message });

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: { submitted: true }
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle support requests
async function handleSupport(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { userId, issue, description, priority } = req.body;

    if (!issue || !description) {
      return res.status(400).json({ success: false, message: 'Issue and description are required' });
    }

    // Here you would typically save to database
    console.log('Support request:', { userId, issue, description, priority });

    res.status(200).json({
      success: true,
      message: 'Support request submitted successfully',
      data: { ticketId: 'TICKET-' + Date.now() }
    });
  } catch (error) {
    console.error('Support error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle feedback submissions
async function handleFeedback(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { userId, rating, feedback, category } = req.body;

    if (!rating || !feedback) {
      return res.status(400).json({ success: false, message: 'Rating and feedback are required' });
    }

    // Here you would typically save to database
    console.log('Feedback submission:', { userId, rating, feedback, category });

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { submitted: true }
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get app information
async function handleAppInfo(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const appInfo = {
      name: 'SERA Food Delivery',
      version: '1.0.0',
      description: 'Delicious food delivered to your doorstep',
      features: [
        'Restaurant Discovery',
        'Food Ordering',
        'Real-time Tracking',
        'Secure Payments',
        'User Reviews'
      ],
      contact: {
        email: 'support@serafood.com',
        phone: '+91-1234567890',
        address: 'Mumbai, Maharashtra, India'
      },
      social: {
        facebook: 'https://facebook.com/serafood',
        twitter: 'https://twitter.com/serafood',
        instagram: 'https://instagram.com/serafood'
      }
    };

    res.status(200).json({
      success: true,
      message: 'App info retrieved successfully',
      data: { appInfo }
    });
  } catch (error) {
    console.error('App info error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle notifications
async function handleNotifications(req, res) {
  if (req.method === 'GET') {
    return getNotifications(req, res);
  } else if (req.method === 'POST') {
    return createNotification(req, res);
  } else if (req.method === 'PUT') {
    return updateNotification(req, res);
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

// Get notifications
async function getNotifications(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: { notifications }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Create notification
async function createNotification(req, res) {
  try {
    const { userId, title, message, type, action, orderId, promoCode, expiresAt } = req.body;

    if (!userId || !title || !message || !type) {
      return res.status(400).json({ success: false, message: 'User ID, title, message, and type are required' });
    }

    const notification = new Notification({
      userId,
      title,
      message,
      type,
      action: action || 'none',
      orderId,
      promoCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification created successfully',
      data: { notificationId: notification._id }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Update notification (mark as read)
async function updateNotification(req, res) {
  try {
    const { notificationId } = req.query;
    const { isRead } = req.body;

    if (!notificationId) {
      return res.status(400).json({ success: false, message: 'Notification ID is required' });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Handle promotions
async function handlePromotions(req, res) {
  if (req.method === 'POST') {
    return createPromoCode(req, res);
  } else if (req.method === 'GET') {
    return getPromoCodes(req, res);
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

// Create promo code
async function createPromoCode(req, res) {
  try {
    const { userId, type, discountPercentage = 20, minimumOrderAmount = 300 } = req.body;

    if (!userId || !type) {
      return res.status(400).json({ success: false, message: 'User ID and type are required' });
    }

    // Generate unique promo code
    const code = generatePromoCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const promoCode = new PromoCode({
      code,
      userId,
      type,
      discountPercentage,
      minimumOrderAmount,
      expiresAt
    });

    await promoCode.save();

    // Create notification for the promo code
    const notification = new Notification({
      userId,
      title: type === 'birthday' ? 'Happy Birthday! 🎂' : 'Special Offer! 🎁',
      message: `Get ${discountPercentage}% off on orders above ₹${minimumOrderAmount}. Use code: ${code}`,
      type: type === 'birthday' ? 'birthday' : 'promo',
      action: 'use_code',
      promoCode: code,
      expiresAt
    });

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Promo code created successfully',
      data: { 
        promoCode: code,
        discountPercentage,
        minimumOrderAmount,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Get promo codes
async function getPromoCodes(req, res) {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const promoCodes = await PromoCode.find({ 
      userId, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Promo codes retrieved successfully',
      data: { promoCodes }
    });
  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

// Generate unique promo code
function generatePromoCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
