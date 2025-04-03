import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Try to send verification email, but don't fail registration if it fails
    let emailSent = true;
    let emailError = null;
    
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
      emailSent = false;
      emailError = emailErr.message;
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Registration successful. Please check your email to verify your account.' 
        : 'Registration successful, but there was a problem sending the verification email. Please contact support.',
      emailSent,
      emailError,
      userId: result.insertedId
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during registration',
        details: error.message
      },
      { status: 500 }
    );
  }
} 