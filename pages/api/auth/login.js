const connectDB = require('../../../lib/db');
const User = require('../../../models/User');
const { generateToken } = require('../../../lib/jwt');

module.exports = async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    console.log('[API] Login: Method not allowed');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('[API] Login: Starting login process');
    const { email, password, userType } = req.body;
    
    // Connect to the database
    console.log('[API] Login: Connecting to database');
    await connectDB();
    console.log('[API] Login: Database connected');
    
    // Find user by email
    console.log(`[API] Login: Finding user with email: ${email}`);
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      console.log(`[API] Login: User not found with email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check user type
    if (user.userType !== userType) {
      console.log(`[API] Login: User type mismatch. Expected: ${userType}, Got: ${user.userType}`);
      return res.status(401).json({ success: false, message: 'Invalid user type' });
    }
    
    console.log('[API] Login: User found, verifying password');
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('[API] Login: Password verification failed');
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    
    console.log('[API] Login: Password verified, generating token');
    
    // Generate JWT token
    const token = generateToken(user);
    
    console.log('[API] Login: Success, returning user data');
    
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
    console.error('[API] Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Login failed',
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 