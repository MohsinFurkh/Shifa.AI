import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function PUT(request) {
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
    
    // Parse the request body
    const { recordId, updatedData } = await request.json();

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { error: 'No update data provided' },
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
        { error: 'You do not have permission to update this record' },
        { status: 403 }
      );
    }
    
    // Prevent updating immutable fields
    const safeUpdate = { ...updatedData };
    delete safeUpdate._id;
    delete safeUpdate.userId;
    delete safeUpdate.createdAt;
    
    // Add updated timestamp
    safeUpdate.updatedAt = new Date();
    
    // Update the record
    const result = await db.collection('medical_records').updateOne(
      { _id: objectId },
      { $set: safeUpdate }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes were made to the record' },
        { status: 304 }
      );
    }
    
    // Fetch the updated record
    const updatedRecord = await db.collection('medical_records').findOne({
      _id: objectId
    });
    
    return NextResponse.json({
      success: true,
      message: 'Record updated successfully',
      record: updatedRecord
    });
    
  } catch (error) {
    console.error('Error updating medical record:', error);
    return NextResponse.json(
      { error: 'Failed to update medical record' },
      { status: 500 }
    );
  }
} 