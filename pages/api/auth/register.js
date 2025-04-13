import { findUserByEmail, createUser, hashPassword } from '../../../lib/static-data';
import { generateToken } from '../../../lib/jwt';

// Make sure this function is exported as default
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password, userType } = req.body;
    
    // Only allow patient registration through this endpoint
    if (userType !== 'patient') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only patient registration is allowed' 
      });
    }
    
    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const user = createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user data (without password) and token
    return res.status(201).json({
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
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
} 