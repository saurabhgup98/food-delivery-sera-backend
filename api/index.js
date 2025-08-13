export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Check if this is a root request or API request
  const isRootRequest = req.url === '/' || req.url === '/api' || req.url === '/api/';
  
  if (isRootRequest) {
    res.status(200).json({
      message: 'Food Delivery Backend API',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        test: '/api/test',
        health: '/api/health'
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      availableEndpoints: ['/api/test', '/api/health']
    });
  }
}
