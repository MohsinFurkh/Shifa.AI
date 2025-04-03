import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';

export async function GET(request) {
  const results = {
    mongodb: { status: 'unknown' },
    email: { status: 'unknown' },
    env: {}
  };

  // Check MongoDB connection
  try {
    const db = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    results.mongodb = {
      status: 'connected',
      collections: collections.map(c => c.name)
    };
  } catch (error) {
    results.mongodb = {
      status: 'error',
      message: error.message
    };
  }

  // Check environment variables (hide sensitive info)
  results.env = {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set',
    EMAIL_USER: process.env.EMAIL_USER ? 'Set (hidden)' : 'Not set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set (hidden)' : 'Not set',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set'
  };

  // Don't test email by default to avoid sending too many emails
  if (request.nextUrl.searchParams.get('test_email') === 'true') {
    const testEmail = request.nextUrl.searchParams.get('email');
    
    if (testEmail) {
      try {
        // Generate a test token
        const testToken = 'test-token-' + Date.now();
        
        // Send a test email
        await sendVerificationEmail(testEmail, testToken);
        
        results.email = {
          status: 'sent',
          to: testEmail
        };
      } catch (error) {
        results.email = {
          status: 'error',
          message: error.message
        };
      }
    } else {
      results.email = {
        status: 'skipped',
        message: 'No email provided'
      };
    }
  }

  return NextResponse.json(results);
} 