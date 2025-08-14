import connectDB from '../../lib/mongodb.js';
import Order from '../../models/Order.js';
import { verifyToken } from '../../lib/jwt.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    if (req.method === 'GET') {
      // Get specific order
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const order = await Order.findOne({ _id: id, userId: decoded.userId });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order }
      });

    } else if (req.method === 'PUT') {
      // Update order status (for admin/restaurant use)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      const order = await Order.findOne({ _id: id, userId: decoded.userId });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.status = status;
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
      });

    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Order API error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
