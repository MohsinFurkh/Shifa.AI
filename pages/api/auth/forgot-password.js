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
    
    const { email, userType } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (!userType) {
      return res.status(400).json({ success: false, message: 'User type is required' });
    }
    
    // Find user by email in database
    const user = await User.findOne({ email, userType });
    
    // If user not found, still return success to prevent email enumeration
    if (!user) {
      console.log(`User not found for reset password: ${email} (${userType})`);
      return res.status(200).json({ 
        success: true, 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Save to database with expiry (1 hour)
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${user.email}`;
    
    // In a production environment, we would send an email here
    console.log('Password reset link:', resetUrl);
    
    // For development purposes, log the reset token
    console.log('Reset token (for development):', resetToken);
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
      // Only include the resetUrl in development environment
      ...(process.env.NODE_ENV === 'development' && { resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    });
  }
} 