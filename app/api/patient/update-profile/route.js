import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';
import { ObjectId } from 'mongodb';

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

    // Verify token validity
    const verified = verifyToken(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get the authenticated user's ID
    const userId = verified.id;
    
    // Parse the request body
    const profileData = await request.json();
    
    // Validate required fields
    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Clean up the profile data to remove any sensitive or unnecessary fields
    const sanitizedProfileData = {
      // Basic Information
      name: profileData.name,
      phone: profileData.phone,
      // Medical Information
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      bloodType: profileData.bloodType,
      allergies: profileData.allergies,
      medicalConditions: profileData.medicalConditions,
      medications: profileData.medications,
      // Health Metrics (these will also be stored in a separate collection)
      height: profileData.height,
      weight: profileData.weight,
      bloodPressure: profileData.bloodPressure,
      heartRate: profileData.heartRate,
      glucoseLevel: profileData.glucoseLevel,
      // Update timestamp
      updatedAt: new Date()
    };

    // Update the user's profile in the MongoDB 'users' collection
    const userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    
    // Perform the update
    const result = await db.collection('users').updateOne(
      { _id: userObjectId },
      { $set: sanitizedProfileData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the updated user data
    const updatedUser = await db.collection('users').findOne({ _id: userObjectId });
    
    // Remove sensitive information before returning
    if (updatedUser) {
      delete updatedUser.password;
      delete updatedUser.resetToken;
      delete updatedUser.resetTokenExpiry;
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 