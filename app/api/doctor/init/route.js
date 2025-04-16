import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

export async function POST(request) {
  try {
    const { doctorType, userId } = await request.json();
    
    // Validate doctor type
    if (!doctorType || (doctorType !== 'personal' && doctorType !== 'general')) {
      return NextResponse.json(
        { message: 'Valid doctor type required (personal or general)' },
        { status: 400 }
      );
    }
    
    // For personal doctor, ensure user exists in database
    if (doctorType === 'personal' && userId) {
      try {
        const { db } = await connectToDatabase();
        
        // Check if user exists
        let user = await db.collection('users').findOne({ userId });
        
        // If not, create a new user record
        if (!user) {
          await db.collection('users').insertOne({
            userId,
            healthData: {},
            chatHistory: [],
            createdAt: new Date()
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even with database error, as we can still provide a stateless experience
      }
    }
    
    // Create JWT token with doctor type information
    const token = jwt.sign(
      { 
        userId, 
        doctorType,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
      }, 
      JWT_SECRET
    );
    
    return NextResponse.json({ token, doctorType });
  } catch (error) {
    console.error('Session initialization error:', error);
    return NextResponse.json(
      { message: 'Error initializing doctor session' },
      { status: 500 }
    );
  }
} 