import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/mongodb';

// GET endpoint to fetch a user's medical records
export async function GET(request) {
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
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const recordType = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build the query
    const query = { userId: userId };
    
    // Add search term if provided
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { doctor: { $regex: searchTerm, $options: 'i' } },
        { findings: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Add record type filter if provided
    if (recordType) {
      query.type = recordType;
    }

    // Fetch records with pagination
    const records = await db
      .collection('medical_records')
      .find(query)
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalRecords = await db
      .collection('medical_records')
      .countDocuments(query);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);
    
    return NextResponse.json({
      records,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        hasMore: page < totalPages
      }
    });
    
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
} 