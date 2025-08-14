export default function handler(req, res) {
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
    // Get authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // For now, simulate token validation
    // In a real app, you would verify the JWT token
    if (!token || !token.startsWith('mock_jwt_token_')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Mock user data
    const mockUser = {
      _id: 'user_123456789',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      phone: '',
      avatar: ''
    };
    
    res.status(200).json({
      success: true,
      message: 'User data retrieved successfully',
      data: {
        user: mockUser
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
