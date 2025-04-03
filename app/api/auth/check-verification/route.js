import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const users = db.collection('users');

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isRegistered: true,
      isVerified: user.isVerified,
      email: user.email,
    });
  } catch (error) {
    console.error('Check verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while checking verification status' },
      { status: 500 }
    );
  }
} 