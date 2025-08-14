import connectDB from '../../lib/mongodb.js';
import Order from '../../models/Order.js';
import { verifyToken } from '../../lib/jwt.js';

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

    if (req.method === 'POST') {
      // Create new order
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { restaurantId, restaurantName, items, subtotal, deliveryFee, total, deliveryAddress, deliveryInstructions } = req.body;

      // Validate required fields
      if (!restaurantId || !restaurantName || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      if (!subtotal || !deliveryFee || !total || !deliveryAddress) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Create the order
      const order = new Order({
        userId: decoded.userId,
        restaurantId,
        restaurantName,
        items,
        subtotal,
        deliveryFee,
        total,
        deliveryAddress,
        deliveryInstructions
      });

      await order.save();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });

    } else if (req.method === 'GET') {
      // Get user's orders
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { status, limit = 10, page = 1 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build query
      const query = { userId: decoded.userId };
      if (status && status !== 'all') {
        query.status = status;
      }

      // Get orders with pagination
      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const totalCount = await Order.countDocuments(query);
      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: {
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });

    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Orders API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
