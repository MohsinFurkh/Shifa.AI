import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify the token
    const verified = verifyToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Use the user ID from the token if not provided in the query
    const authenticatedUserId = verified.id;
    const requestedUserId = userId || authenticatedUserId;
    
    // Only allow access to own medications unless admin
    if (authenticatedUserId !== requestedUserId && !verified.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    if (!requestedUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Fetch user medications
    const medications = await db
      .collection('medications')
      .find({ userId: requestedUserId })
      .sort({ startDate: -1 }) // Sort by start date descending (newest first)
      .toArray();
    
    // Return the medications, even if it's an empty array
    return NextResponse.json({ medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new medication
export async function POST(request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify the token
    const verified = verifyToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = verified.id;
    
    // Parse request body
    const medicationData = await request.json();
    
    // Validate required fields
    if (!medicationData.name || !medicationData.dosage || !medicationData.frequency || !medicationData.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Create new medication object
    const newMedication = {
      userId,
      name: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency,
      startDate: medicationData.startDate,
      endDate: medicationData.endDate || '',
      instructions: medicationData.instructions || '',
      prescribedBy: medicationData.prescribedBy || '',
      active: !medicationData.endDate || new Date(medicationData.endDate) >= new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the medication into the database
    const result = await db.collection('medications').insertOne(newMedication);
    
    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to save medication' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Medication added successfully',
      medicationId: result.insertedId
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    return NextResponse.json(
      { error: 'Failed to add medication' },
      { status: 500 }
    );
  }
} 