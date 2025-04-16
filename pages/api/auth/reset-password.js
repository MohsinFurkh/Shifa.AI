import crypto from 'crypto';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const { token, email, password } = req.body;
    
    // Validate required fields
    if (!token || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token, email, and password are required' 
      });
    }
    
    // Minimum password length
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    // Hash the token from the URL to match stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user by email and token, and ensure token is not expired
    const user = await User.findOne({
      email,
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    
    // Update password and clear reset token fields
    user.password = password; // Will be hashed by the pre-save hook
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred. Please try again later.'
    });
  }
} 