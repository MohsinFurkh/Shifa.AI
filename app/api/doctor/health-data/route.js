import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

// Helper function to verify JWT token
const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function GET(request) {
  try {
    // Verify token
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if this is a personal doctor session
    if (user.doctorType !== 'personal') {
      return NextResponse.json(
        { message: 'This endpoint is only for Personal AI Doctor' },
        { status: 403 }
      );
    }
    
    // Get user data from database
    const { db } = await connectToDatabase();
    const userData = await db.collection('users').findOne({ userId: user.userId });
    
    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return health data and chat history
    return NextResponse.json({
      healthData: userData.healthData || {},
      chatHistory: userData.chatHistory || []
    });
  } catch (error) {
    console.error('Health data fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching health data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Verify token
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if this is a personal doctor session
    if (user.doctorType !== 'personal') {
      return NextResponse.json(
        { message: 'This endpoint is only for Personal AI Doctor' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const { healthData } = await request.json();
    
    // Validate health data
    if (!healthData) {
      return NextResponse.json(
        { message: 'Health data is required' },
        { status: 400 }
      );
    }
    
    // Update health data in database
    const { db } = await connectToDatabase();
    
    await db.collection('users').updateOne(
      { userId: user.userId },
      { $set: { healthData: healthData } },
      { upsert: true }
    );
    
    return NextResponse.json({ message: 'Health data updated successfully' });
  } catch (error) {
    console.error('Health data update error:', error);
    return NextResponse.json(
      { message: 'Error updating health data' },
      { status: 500 }
    );
  }
} 