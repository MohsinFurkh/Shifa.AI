import { NextResponse } from 'next/server';
import dbConnect from '../../utils/db.js';
import User from '../../models/user.js';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, status } = await request.json();
    
    await dbConnect();
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.status = status;
    await user.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Account ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      text: `Your account has been ${status === 'approved' ? 'approved' : 'rejected'} by the administrator.`
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: `User ${status} successfully` });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 