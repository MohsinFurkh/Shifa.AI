import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function DELETE(request) {
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
    
    // Get the record ID from the query params
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('recordId');

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Verify the record exists and belongs to the user
    let objectId;
    try {
      objectId = new ObjectId(recordId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid record ID format' },
        { status: 400 }
      );
    }
    
    const record = await db.collection('medical_records').findOne({
      _id: objectId
    });
    
    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }
    
    // Check if the record belongs to the user
    if (record.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this record' },
        { status: 403 }
      );
    }
    
    // Delete the record
    const result = await db.collection('medical_records').deleteOne({
      _id: objectId
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete the record' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json(
      { error: 'Failed to delete medical record' },
      { status: 500 }
    );
  }
} 