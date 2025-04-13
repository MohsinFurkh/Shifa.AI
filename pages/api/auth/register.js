const connectDB = require('../../../lib/db');
const User = require('../../../models/User');
const { generateToken } = require('../../../lib/jwt');

module.exports = async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password, userType } = req.body;
    
    // Connect to the database
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
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
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
} 