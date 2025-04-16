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

    // Try to convert to ObjectId if valid
    let userObjectId = null;
    if (ObjectId.isValid(userId)) {
      userObjectId = new ObjectId(userId);
    }
    
    console.log('Looking for user with ID:', userId);
    
    // First, try to find the user in myFirstDatabase.users to confirm they exist
    let mainUser = null;
    
    // Try finding by _id first (if we have a valid ObjectId)
    if (userObjectId) {
      mainUser = await db.collection('users').findOne({ _id: userObjectId });
      console.log('Search by _id in myFirstDatabase.users result:', !!mainUser);
    }
    
    // If not found by _id, try finding by userId field
    if (!mainUser) {
      mainUser = await db.collection('users').findOne({ userId: userId });
      console.log('Search by userId in myFirstDatabase.users result:', !!mainUser);
    }
    
    // If still not found, try email if provided
    if (!mainUser && profileData.email) {
      mainUser = await db.collection('users').findOne({ email: profileData.email });
      console.log('Search by email in myFirstDatabase.users result:', !!mainUser);
    }
    
    if (!mainUser) {
      console.error('User not found in myFirstDatabase.users. userId:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create update operations for mainUser
    let updateOperations = [];
    
    // 1. Update main user profile in myFirstDatabase.users
    // Update firstName and lastName if name is provided
    if (sanitizedProfileData.name) {
      const nameParts = sanitizedProfileData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      updateOperations.push({
        updateOne: {
          filter: { _id: mainUser._id },
          update: { 
            $set: { 
              firstName: firstName,
              lastName: lastName || '',
              updatedAt: new Date()
            } 
          }
        }
      });
    }

    // 2. Find or create user profile in shifaai.users
    const shifaaiDb = db.client.db('shifaai');
    let shifaaiUser = await shifaaiDb.collection('users').findOne({ userId: userId });
    
    if (shifaaiUser) {
      console.log('Found user in shifaai.users collection');
      
      // Update healthData in shifaai.users
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
      
      updateOperations.push({
        updateOne: {
          filter: { userId: userId },
          update: { 
            $set: { healthData: healthData } 
          },
          upsert: true
        }
      });
    } else {
      console.log('Creating new user in shifaai.users collection');
      
      // Create new user in shifaai.users
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
      
      const newShifaaiUser = {
        userId: userId,
        healthData: healthData,
        chatHistory: [],
        createdAt: new Date()
      };
      
      await shifaaiDb.collection('users').insertOne(newShifaaiUser);
      console.log('Created new user in shifaai.users');
    }
    
    // 3. Update or create health metrics in healthmetrics collection
    // Add userId to health metrics
    healthMetricsData.userId = userId;
    
    updateOperations.push({
      insertOne: {
        document: healthMetricsData
      }
    });
    
    // Execute all operations
    console.log('Performing bulk write operations');
    try {
      // Update main user profile
      if (updateOperations.length > 0) {
        const bulkResult = await db.collection('users').bulkWrite(updateOperations.filter(op => op.updateOne && op.updateOne.filter._id));
        console.log('Main user profile update result:', bulkResult);
      }
      
      // Insert new health metrics
      const metricsResult = await db.collection('healthmetrics').insertOne(healthMetricsData);
      console.log('Health metrics insert result:', metricsResult);
      
      // Update shifaai user
      const shifaaiUpdateOps = updateOperations.filter(op => op.updateOne && op.updateOne.filter.userId);
      if (shifaaiUpdateOps.length > 0) {
        const shifaaiResult = await shifaaiDb.collection('users').bulkWrite(shifaaiUpdateOps);
        console.log('Shifaai user update result:', shifaaiResult);
      }
    } catch (error) {
      console.error('Error performing database operations:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile: ' + error.message },
        { status: 500 }
      );
    }

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
      { error: 'Failed to update profile: ' + error.message },
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