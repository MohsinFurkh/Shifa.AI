import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';
import OpenAI from 'openai';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Helper function to verify JWT token
const verifyToken = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function POST(request) {
  try {
    // Verify token
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }
    
    const doctorType = user.doctorType;
    const userId = user.userId;
    
    // Set up system prompt based on doctor type
    let systemPrompt = "You are an AI doctor providing health information. Remember to maintain medical ethics and remind users you're not a replacement for professional medical care.";
    let previousMessages = [];
    
    // For personal doctor, fetch user data and chat history
    if (doctorType === 'personal') {
      try {
        const { db } = await connectToDatabase();
        const userData = await db.collection('users').findOne({ userId });
        
        if (userData) {
          // Include health data in system prompt
          systemPrompt += " This user has the following health information:";
          
          if (userData.healthData) {
            if (userData.healthData.age) systemPrompt += ` Age: ${userData.healthData.age}.`;
            if (userData.healthData.gender) systemPrompt += ` Gender: ${userData.healthData.gender}.`;
            if (userData.healthData.conditions?.length) systemPrompt += ` Medical conditions: ${userData.healthData.conditions.join(', ')}.`;
            if (userData.healthData.medications?.length) systemPrompt += ` Medications: ${userData.healthData.medications.join(', ')}.`;
            if (userData.healthData.allergies?.length) systemPrompt += ` Allergies: ${userData.healthData.allergies.join(', ')}.`;
          }
          
          // Get last 10 messages for context
          if (userData.chatHistory && userData.chatHistory.length > 0) {
            previousMessages = userData.chatHistory
              .slice(-10)
              .map(msg => ({
                role: msg.role,
                content: msg.content
              }));
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even with database error - we'll just have less context
      }
    } else {
      // For general doctor, add emphasis on privacy
      systemPrompt += " This is a general consultation without user-specific data. Maintain privacy and provide general guidance only.";
    }
    
    // Prepare messages for AI
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...previousMessages,
      { role: 'user', content: message }
    ];
    
    // Call the AI service
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // adjust based on your OpenAI plan
      messages: aiMessages,
      temperature: 0.7
    });
    
    const aiResponse = response.choices[0].message.content;
    
    // Save conversation to database for Personal AI Doctor
    if (doctorType === 'personal') {
      try {
        const { db } = await connectToDatabase();
        
        await db.collection('users').updateOne(
          { userId },
          { 
            $push: { 
              chatHistory: {
                $each: [
                  { role: 'user', content: message, timestamp: new Date() },
                  { role: 'assistant', content: aiResponse, timestamp: new Date() }
                ]
              }
            } 
          }
        );
      } catch (dbError) {
        console.error('Database error while saving chat:', dbError);
        // Continue even with save error - user will still get their response
      }
    }
    
    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { message: 'Error processing your request' },
      { status: 500 }
    );
  }
} 