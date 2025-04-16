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

    // Try to convert to ObjectId if valid
    let userObjectId = null;
    if (ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
    }
    
    console.log('Looking for user with ID:', userId);
    
    // First, try to find the user to confirm they exist
    let user = null;
    
    // Try finding by _id first (if we have a valid ObjectId)
    if (userObjectId) {
      user = await db.collection('users').findOne({ _id: userObjectId });
      console.log('Search by _id result:', !!user);
    }
    
    // If not found by _id, try finding by userId field
    if (!user) {
      user = await db.collection('users').findOne({ userId: userId });
      console.log('Search by userId result:', !!user);
    }
    
    // If still not found, try email if provided
    if (!user && profileData.email) {
      user = await db.collection('users').findOne({ email: profileData.email });
      console.log('Search by email result:', !!user);
    }
    
    if (!user) {
      console.error('User not found with any ID method. userId:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Now we have found the user, use the correct ID field for the update
    const userIdField = userObjectId && user._id ? '_id' : 'userId';
    const userIdValue = userObjectId && user._id ? userObjectId : userId;
    
    console.log(`Updating profile for user with ${userIdField}:`, userIdValue);
    
    // Perform the update with the correct field
    const query = {};
    query[userIdField] = userIdValue;
    
    const result = await db.collection('users').updateOne(
      query,
      { $set: sanitizedProfileData }
    );

    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.error(`User not found with ${userIdField}:`, userIdValue);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 404 }
      );
    }

    // Get the updated user data
    const updatedUser = await db.collection('users').findOne(query);
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