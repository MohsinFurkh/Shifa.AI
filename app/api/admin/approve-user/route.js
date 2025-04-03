import { NextResponse } from 'next/server';
import dbConnect from '../../utils/db';
import User from '../../models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { userId, status } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.status = status;
    await user.save();

    // Send approval/rejection email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const emailSubject = status === 'approved' 
      ? 'Your account has been approved' 
      : 'Your account has been rejected';

    const emailBody = status === 'approved'
      ? 'Your account has been approved. You can now log in to your account.'
      : 'Your account has been rejected. Please contact support for more information.';

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: emailSubject,
      html: `
        <h1>Account Status Update</h1>
        <p>${emailBody}</p>
      `
    });

    return NextResponse.json(
      { message: `User ${status} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Error updating user status' },
      { status: 500 }
    );
  }
} 