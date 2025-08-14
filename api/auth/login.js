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
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
  
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // For now, simulate successful login for any valid email/password
    // In a real app, you would verify against database
    const mockUser = {
      _id: 'user_' + Date.now(),
      name: email.split('@')[0], // Use email prefix as name
      email,
      role: 'user',
      phone: '',
      avatar: ''
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        token: mockToken
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
