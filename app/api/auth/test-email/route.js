import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a test token
    const testToken = 'test-verification-token-' + Date.now();

    // Send a test verification email
    await sendVerificationEmail(email, testToken);

    return NextResponse.json({
      success: true,
      message: 'Test verification email sent successfully.',
      token: testToken
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 