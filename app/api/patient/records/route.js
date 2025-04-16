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
    if (token) {
      try {
        const verified = verifyToken(token);
        if (!verified || (verified.id !== userId && !verified.isAdmin)) {
          return NextResponse.json(
            { error: 'Unauthorized access' },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Fetch medical records for the user
    const records = await db
      .collection('medical_records')
      .find({ userId })
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .toArray();
    
    // If no records exist yet, return sample data for demonstration
    if (records.length === 0) {
      return NextResponse.json({
        records: getSampleMedicalRecords(userId)
      });
    }
    
    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
}

// Sample data function to provide initial records for demonstration
function getSampleMedicalRecords(userId) {
  return [
    {
      userId,
      title: 'Annual Physical Examination',
      type: 'consultation',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      status: 'reviewed',
      doctor: 'John Smith',
      findings: 'Patient is in good health. Blood pressure 120/80, heart rate 72 bpm, normal lung sounds.',
      fileUrl: null
    },
    {
      userId,
      title: 'Blood Work Results',
      type: 'lab',
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      status: 'reviewed',
      doctor: 'Mary Johnson',
      findings: 'All values within normal range except slightly elevated cholesterol (210 mg/dL).',
      fileUrl: null
    },
    {
      userId,
      title: 'Chest X-Ray',
      type: 'imaging',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      status: 'reviewed',
      doctor: 'Robert Davis',
      findings: 'No significant abnormalities detected. Lung fields clear. Heart size normal.',
      fileUrl: null
    },
    {
      userId,
      title: 'Prescription Renewal',
      type: 'prescription',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      status: 'new',
      doctor: 'Sarah Wilson',
      findings: 'Renewal of hypertension medication for 3 months. Take as directed.',
      fileUrl: null
    }
  ];
} 