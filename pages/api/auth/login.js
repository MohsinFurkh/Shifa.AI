import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import { generateToken } from '../../../lib/jwt';

// Make sure this function is exported as default
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { email, password, userType } = req.body;
    
    console.log('Login attempt:', { email, userType });
    
    // Find user by email in database
    const user = await User.findOne({ email });
    console.log('User found:', user ? { 
      id: user._id,
      email: user.email,
      userType: user.userType,
      passwordProvided: password ? '***' : 'none',
      passwordInDB: user.password ? 'exists' : 'none'
    } : 'No user found');
    
    // Check if user exists and is of the correct type
    if (!user || user.userType !== userType) {
      console.log('User type mismatch or user not found:', { 
        userFound: !!user, 
        requestedType: userType, 
        actualType: user?.userType 
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      userType: user.userType
    });
    
    console.log('Login successful for:', { email, userType });
    
    // Return user data and token
    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
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