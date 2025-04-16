import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';
import { ObjectId } from 'mongodb';

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
    
    // Only allow access to own consultations unless admin
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
    
    // Format user ID for MongoDB query
    const userObjectId = ObjectId.isValid(requestedUserId) ? new ObjectId(requestedUserId) : requestedUserId;
    
    // Fetch consultations for the user
    const consultations = await db
      .collection('consultations')
      .find({ patientId: userObjectId })
      .sort({ date: -1 }) // Sort by date descending (newest first)
      .toArray();
    
    // Fetch doctor information for each consultation
    const consultationsWithDoctorInfo = await Promise.all(
      consultations.map(async (consultation) => {
        if (consultation.doctorId) {
          const doctorId = ObjectId.isValid(consultation.doctorId) 
            ? new ObjectId(consultation.doctorId) 
            : consultation.doctorId;
          
          const doctor = await db.collection('users').findOne(
            { _id: doctorId, type: 'doctor' },
            { projection: { name: 1, specialty: 1, profileImage: 1 } }
          );
          
          if (doctor) {
            return {
              ...consultation,
              doctor: doctor.name,
              specialty: doctor.specialty,
              doctorProfileImage: doctor.profileImage
            };
          }
        }
        
        // If doctor not found or no doctorId, return as is
        return consultation;
      })
    );
    
    // If no consultations exist yet, return empty array
    return NextResponse.json({ 
      consultations: consultationsWithDoctorInfo 
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
} 