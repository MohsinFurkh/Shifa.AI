const connectDB = require('../../../lib/db');
const User = require('../../../models/User');
const { generateToken } = require('../../../lib/jwt');

module.exports = async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    console.log('[API] Register: Method not allowed');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('[API] Register: Starting registration process');
    const { firstName, lastName, email, password, userType } = req.body;
    
    // Validate input
    if (!firstName || !lastName || !email || !password || !userType) {
      console.log('[API] Register: Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required',
        missingFields: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          password: !password,
          userType: !userType
        }
      });
    }
    
    // Connect to the database
    console.log('[API] Register: Connecting to database');
    await connectDB();
    console.log('[API] Register: Database connected');
    
    // Check if user already exists
    console.log(`[API] Register: Checking if email exists: ${email}`);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[API] Register: Email already registered');
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    
    // Create new user
    console.log('[API] Register: Creating new user');
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType
    });
    
    console.log('[API] Register: User created, generating token');
    
    // Generate JWT token
    const token = generateToken(user);
    
    console.log('[API] Register: Success, returning user data');
    
    // Return user data (without password) and token
    return res.status(201).json({
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
    console.error('[API] Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 