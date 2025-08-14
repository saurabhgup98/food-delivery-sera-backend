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
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // For now, simulate successful registration
    // In a real app, you would hash the password and save to database
    const mockUser = {
      _id: 'user_' + Date.now(),
      name,
      email,
      role: 'user',
      phone: '',
      avatar: ''
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: mockUser,
        token: mockToken
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
