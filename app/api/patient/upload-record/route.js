import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    // Extract the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    // Extract and verify the token
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'development_secret_key';
    
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    
    // Parse request body
    const body = await request.json();
    const { title, type, date, doctor, findings, fileUrl, status } = body;
    
    // Validate required fields
    if (!title || !type || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, and date are required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Create record object
    const record = {
      userId,
      title,
      type,
      date,
      doctor: doctor || 'Not specified',
      findings: findings || '',
      fileUrl: fileUrl || '',
      status: status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the record into the database
    const result = await db.collection('medical_records').insertOne(record);
    
    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to save medical record' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Medical record uploaded successfully',
      recordId: result.insertedId
    });
    
  } catch (error) {
    console.error('Error uploading medical record:', error);
    return NextResponse.json(
      { error: 'Failed to upload medical record' },
      { status: 500 }
    );
  }
}