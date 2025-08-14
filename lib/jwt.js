import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const verifyToken = (token) => {
  try {
    console.log('JWT_SECRET length:', JWT_SECRET.length);
    console.log('Token to verify:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    throw new Error('Invalid token');
  }
};
