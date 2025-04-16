import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Parse the request body
    const { email, userType } = await request.json();
    
    // Validate inputs
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!userType) {
      return NextResponse.json(
        { success: false, message: 'User type is required' },
        { status: 400 }
      );
    }
    
    console.log(`Password reset requested for: ${email} (${userType})`);
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Find user by email in database
    const user = await db.collection('users').findOne({ 
      email: email,
      userType: userType 
    });
    
    // If user not found, still return success to prevent email enumeration
    if (!user) {
      console.log(`User not found for reset password: ${email} (${userType})`);
      return NextResponse.json({ 
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
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $set: {
          resetToken: hashedToken,
          resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour
        } 
      }
    );
    
    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${user.email}`;
    
    // In a production environment, we would send an email here
    console.log('Password reset link:', resetUrl);
    
    // For development purposes, log the reset token
    console.log('Reset token (for development):', resetToken);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
      // Only include the resetUrl in development environment for testing
      ...(process.env.NODE_ENV !== 'production' && { resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred. Please try again later.'
    }, { status: 500 });
  }
} 