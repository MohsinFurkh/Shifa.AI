import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    console.log('Update profile API called');
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid auth header found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('No token found in auth header');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token validity
    console.log('Verifying token...');
    const verified = verifyToken(token);
    
    if (!verified) {
      console.error('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('Token verified, user id:', verified.id);
    
    // Get the authenticated user's ID
    const userId = verified.id;
    
    // Parse the request body
    const profileData = await request.json();
    console.log('Profile data received:', { ...profileData, userId });
    
    // Validate required fields
    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connection established');
    
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
    console.log('Updating profile for user with ID:', userObjectId);
    
    // Perform the update
    const result = await db.collection('users').updateOne(
      { _id: userObjectId },
      { $set: sanitizedProfileData }
    );

    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.error('User not found with ID:', userObjectId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the updated user data
    const updatedUser = await db.collection('users').findOne({ _id: userObjectId });
    console.log('Updated user data retrieved');
    
    // Remove sensitive information before returning
    if (updatedUser) {
      delete updatedUser.password;
      delete updatedUser.resetToken;
      delete updatedUser.resetTokenExpiry;
    }

    console.log('Update profile API completed successfully');
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile: ' + error.message },
      { status: 500 }
    );
  }
} 