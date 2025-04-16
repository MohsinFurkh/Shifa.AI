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

export async function DELETE(request) {
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
    
    // Clear chat history in database
    const { db } = await connectToDatabase();
    
    await db.collection('users').updateOne(
      { userId: user.userId },
      { $set: { chatHistory: [] } }
    );
    
    return NextResponse.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear history error:', error);
    return NextResponse.json(
      { message: 'Error clearing chat history' },
      { status: 500 }
    );
  }
} 