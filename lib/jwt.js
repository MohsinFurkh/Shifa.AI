import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

// Generate JWT token from user data
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      type: user.userType
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token and return payload
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
} 