import jwt from 'jsonwebtoken';

// Use an environment variable for the secret in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-here';

// Generate a token from user data
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id, // Support both MongoDB _id and our internal id
      email: user.email,
      type: user.userType || user.type // Support both userType and type
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

// Verify a token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
} 