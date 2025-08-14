import connectDB from '../lib/mongodb.js';
import Order from '../models/Order.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Delete all orders
    const result = await Order.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} orders from database`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Error clearing orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
