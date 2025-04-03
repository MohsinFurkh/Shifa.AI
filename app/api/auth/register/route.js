import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/db';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, password, userType } = await request.json();
    
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userType,
      status: 'pending'
    });
    
    await user.save();
    
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ShifaAI - Verify Your Email',
      text: `Hello ${name},\n\nWelcome to ShifaAI! Please verify your email by clicking the link below:\n\n${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${user._id}\n\nBest regards,\nShifaAI Team`
    };
    
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json(
      { message: 'User registered successfully. Please check your email for verification.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
} 