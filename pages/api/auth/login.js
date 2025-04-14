import { findUserByEmail, comparePassword } from '../../../lib/static-data';
import { generateToken } from '../../../lib/jwt';

// Make sure this function is exported as default
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password, userType } = req.body;
    
    // Find user by email in static data
    const user = findUserByEmail(email);
    
    // Check if user exists and is of the correct type
    if (!user || user.userType !== userType) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data and token
    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        type: user.userType,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Login failed' 
    });
  }
} 