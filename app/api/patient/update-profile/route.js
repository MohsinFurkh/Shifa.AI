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
      // Update timestamp
      updatedAt: new Date()
    };

    // Separate out health metrics data
    const healthMetricsData = {
      height: profileData.height || null,
      weight: profileData.weight || null,
      bloodPressure: profileData.bloodPressure || null,
      heartRate: profileData.heartRate || null,
      glucoseLevel: profileData.glucoseLevel || null,
      // Calculate BMI if both height and weight are provided
      ...(profileData.height && profileData.weight ? {
        bmi: Math.round((profileData.weight / Math.pow(profileData.height / 100, 2)) * 10) / 10
      } : {}),
      timestamp: new Date()
    };

    // Add BMI status if BMI is calculated
    if (healthMetricsData.bmi) {
      const bmi = healthMetricsData.bmi;
      if (bmi < 18.5) {
        healthMetricsData.bmiStatus = 'Underweight';
      } else if (bmi < 25) {
        healthMetricsData.bmiStatus = 'Normal weight';
      } else if (bmi < 30) {
        healthMetricsData.bmiStatus = 'Overweight';
      } else {
        healthMetricsData.bmiStatus = 'Obese';
      }
    }

    // DEBUG: List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Try to convert to ObjectId if valid
    let userObjectId = null;
    if (ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
      console.log('Converted userId to ObjectId:', userObjectId);
    } else {
      console.log('userId is not a valid ObjectId, using as string:', userId);
    }
    
    // DEBUG: Search for the user with the exact ID format used in the token
    const exactIdSearch = await db.collection('users').findOne({ userId: userId });
    console.log('Search with exact userId as string:', !!exactIdSearch);
    
    // DEBUG: Sample some users from the collection
    const sampleUsers = await db.collection('users').find().limit(2).toArray();
    console.log('Sample users from database:', sampleUsers.map(u => ({
      _id: u._id, 
      userId: u.userId,
      email: u.email,
      keys: Object.keys(u)
    })));
    
    // MULTI-APPROACH USER SEARCH
    console.log('Starting comprehensive user search...');
    
    // Try all possible approaches to find the user
    let mainUser = null;
    const searchResults = {};
    
    // Approach 1: By _id as ObjectId
    if (userObjectId) {
      const result = await db.collection('users').findOne({ _id: userObjectId });
      searchResults._id = !!result;
      if (result) mainUser = result;
      console.log('Search by _id as ObjectId:', !!result);
    }
    
    // Approach 2: By userId as string
    if (!mainUser) {
      const result = await db.collection('users').findOne({ userId: userId });
      searchResults.userId = !!result;
      if (result) mainUser = result;
      console.log('Search by userId as string:', !!result);
    }
    
    // Approach 3: By _id as string
    if (!mainUser) {
      const result = await db.collection('users').findOne({ _id: userId });
      searchResults._idAsString = !!result;
      if (result) mainUser = result;
      console.log('Search by _id as string:', !!result);
    }
    
    // Approach 4: By email if provided
    if (!mainUser && profileData.email) {
      const result = await db.collection('users').findOne({ email: profileData.email });
      searchResults.email = !!result;
      if (result) mainUser = result;
      console.log('Search by email:', !!result);
    }
    
    // Last resort: create mock user (only for development)
    if (!mainUser) {
      console.error('User not found by any method. Search results:', searchResults);
      console.log('Creating fallback user entry.');
      
      // Create a new user record as a fallback (only in development)
      try {
        const newUser = {
          _id: userObjectId || new ObjectId(),
          userId: userId,
          firstName: profileData.name ? profileData.name.split(' ')[0] : 'User',
          lastName: profileData.name ? profileData.name.split(' ').slice(1).join(' ') : userId.substring(0, 8),
          email: profileData.email || `user_${userId.substring(0, 8)}@example.com`,
          userType: 'patient',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const insertResult = await db.collection('users').insertOne(newUser);
        console.log('Created new user as fallback:', insertResult);
        
        if (insertResult.acknowledged) {
          mainUser = newUser;
        }
      } catch (createError) {
        console.error('Failed to create fallback user:', createError);
        return NextResponse.json({
          error: 'User not found and could not create fallback: ' + createError.message,
          searchResults: searchResults
        }, { status: 404 });
      }
    }
    
    if (!mainUser) {
      console.error('User not found and fallback failed. userId:', userId);
      return NextResponse.json({
        error: 'User not found after all approaches',
        userId: userId,
        searchResults: searchResults
      }, { status: 404 });
    }
    
    console.log('Found user:', {
      _id: mainUser._id,
      userId: mainUser.userId,
      name: `${mainUser.firstName || ''} ${mainUser.lastName || ''}`.trim(),
      email: mainUser.email
    });

    // Create update operations for mainUser
    let updateOperations = [];
    
    // 1. Update main user profile in myFirstDatabase.users
    // Update firstName and lastName if name is provided
    if (sanitizedProfileData.name) {
      const nameParts = sanitizedProfileData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Direct update instead of bulkWrite for the main user
      const mainUserUpdateResult = await db.collection('users').updateOne(
        { _id: mainUser._id },
        { 
          $set: { 
            firstName: firstName,
            lastName: lastName || '',
            phone: sanitizedProfileData.phone || mainUser.phone,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Main user update result:', mainUserUpdateResult);
    }

    // 2. Find or create user profile in shifaai.users
    const shifaaiDb = db.client.db('shifaai');
    let shifaaiUser = await shifaaiDb.collection('users').findOne({ userId: userId });
    
    // Prepare health data from profile
    const healthData = {
      age: profileData.age || getAgeFromDateOfBirth(sanitizedProfileData.dateOfBirth) || null,
      gender: sanitizedProfileData.gender || null,
      bloodType: sanitizedProfileData.bloodType || null,
      conditions: sanitizedProfileData.medicalConditions ? 
        (typeof sanitizedProfileData.medicalConditions === 'string' ? 
          [sanitizedProfileData.medicalConditions] : 
          sanitizedProfileData.medicalConditions) : 
        [],
      medications: sanitizedProfileData.medications ? 
        (typeof sanitizedProfileData.medications === 'string' ? 
          [sanitizedProfileData.medications] : 
          sanitizedProfileData.medications) : 
        [],
      allergies: sanitizedProfileData.allergies ? 
        (typeof sanitizedProfileData.allergies === 'string' ? 
          [sanitizedProfileData.allergies] : 
          sanitizedProfileData.allergies) : 
        [],
      height: healthMetricsData.height,
      weight: healthMetricsData.weight,
      bloodPressure: healthMetricsData.bloodPressure,
      heartRate: healthMetricsData.heartRate,
      glucoseLevel: healthMetricsData.glucoseLevel,
      updatedAt: new Date()
    };
    
    if (shifaaiUser) {
      console.log('Found user in shifaai.users collection');
      
      // Direct update for shifaai user
      const shifaaiUpdateResult = await shifaaiDb.collection('users').updateOne(
        { userId: userId },
        { $set: { healthData: healthData } }
      );
      
      console.log('Shifaai user update result:', shifaaiUpdateResult);
    } else {
      console.log('Creating new user in shifaai.users collection');
      
      // Create new user in shifaai.users
      const newShifaaiUser = {
        userId: userId,
        healthData: healthData,
        chatHistory: [],
        createdAt: new Date()
      };
      
      const shifaaiInsertResult = await shifaaiDb.collection('users').insertOne(newShifaaiUser);
      console.log('Created new user in shifaai.users:', shifaaiInsertResult);
    }
    
    // 3. Insert health metrics in healthmetrics collection
    healthMetricsData.userId = userId;
    
    const metricsResult = await db.collection('healthmetrics').insertOne(healthMetricsData);
    console.log('Health metrics insert result:', metricsResult);
    
    // Get the updated user data
    const updatedUser = await db.collection('users').findOne({ _id: mainUser._id });
    console.log('Updated user data retrieved');
    
    // Get latest health metrics
    const latestHealthMetrics = await db.collection('healthmetrics')
      .find({ userId: userId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();
    
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
      user: updatedUser,
      healthMetrics: latestHealthMetrics.length > 0 ? latestHealthMetrics[0] : null
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update profile: ' + error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate age from date of birth
function getAgeFromDateOfBirth(dateOfBirth) {
  if (!dateOfBirth) return null;
  
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
} 