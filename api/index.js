export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action } = req.query;

  // Handle health check
  if (action === 'health') {
    return res.status(200).json({
      success: true,
      message: 'Backend is healthy!',
      timestamp: new Date().toISOString(),
      status: 'OK',
      environment: process.env.NODE_ENV || 'development'
    });
  }
  
  // Default API info
  res.status(200).json({
    message: 'Food Delivery Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: '/api',
      health: '/api?action=health',
      restaurants: '/api/restaurants',
      orders: '/api/orders',
      auth: '/api/auth',
      user: '/api/user',
      utilities: '/api/utilities',
      locations: '/api/locations'
    }
  });
}
