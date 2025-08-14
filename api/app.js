import connectDB from '../lib/mongodb.js';

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

    // Mock notifications - in real app, fetch from database
    const notifications = [
      {
        id: '1',
        userId,
        title: 'Order Confirmed',
        message: 'Your order #12345 has been confirmed',
        type: 'order',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId,
        title: 'Delivery Update',
        message: 'Your order is out for delivery',
        type: 'delivery',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

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
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ success: false, message: 'User ID, title, and message are required' });
    }

    // Here you would typically save to database
    console.log('Creating notification:', { userId, title, message, type });

    res.status(200).json({
      success: true,
      message: 'Notification created successfully',
      data: { notificationId: 'NOTIF-' + Date.now() }
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
    const { read } = req.body;

    if (!notificationId) {
      return res.status(400).json({ success: false, message: 'Notification ID is required' });
    }

    // Here you would typically update in database
    console.log('Updating notification:', { notificationId, read });

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: { updated: true }
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
