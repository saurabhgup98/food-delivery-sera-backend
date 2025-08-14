export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://food-delivery-sera.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    // Test database connection
    const connectDB = (await import('../lib/mongodb.js')).default;
    await connectDB();
    
    // Test Restaurant model import
    const Restaurant = (await import('../models/Restaurant.js')).default;
    
    // Try to count restaurants
    const count = await Restaurant.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Restaurant API test successful',
      data: {
        restaurantCount: count,
        message: 'Database connection and Restaurant model working'
      }
    });
    
  } catch (error) {
    console.error('Restaurant API test error:', error);
    res.status(500).json({
      success: false,
      message: 'Restaurant API test failed',
      error: error.message
    });
  }
}
