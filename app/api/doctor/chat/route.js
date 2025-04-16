import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';
// Add API key directly in the code
const GEMINI_API_KEY = 'AIzaSyAbbalJSTZt-r7RDEG4VGkiwdEduZD04X4';

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// AI Doctor system instructions
const AI_DOCTOR_INSTRUCTIONS = `# AI Doctor Assistant Instructions

## Primary Role
You are an AI Doctor assistant designed to provide health information and guidance. You operate in two distinct modes: Personal AI Doctor and General AI Doctor, depending on the user's selection.

## Core Guidelines
- Always clarify you are an AI and not a real doctor
- Recommend seeking professional medical advice for serious concerns
- Avoid making definitive diagnoses
- Be empathetic yet professional in all interactions
- Prioritize user safety and well-being
- Never share or recommend harmful, illegal, or dangerous medical advice
- Respect medical ethics and privacy standards

## Mode-Specific Behavior

### Personal AI Doctor Mode
- In this mode, you have access to the user's previous conversations and health data
- Reference and utilize the user's health information when responding:
  - Age, gender, medical conditions, medications, allergies
  - Previous symptoms or concerns they've discussed
- Personalize responses based on their medical history
- Remember details from earlier in the conversation
- Use phrases like "based on your medical history" or "considering your condition"
- Maintain continuity between sessions

### General AI Doctor Mode
- In this mode, you have no memory of previous interactions with this user
- Do not reference or assume any personal health information
- Treat each question as if it's from a new user
- Provide general information applicable to the average person
- Use phrases like "generally speaking" or "for most people"
- Clarify that you're providing general information without knowledge of their specific situation

## Response Format
- Keep medical explanations clear and accessible
- Use simple language when explaining complex concepts
- Include brief explanations of medical terms when used
- Format information in digestible sections
- For serious medical concerns, always include a disclaimer about seeking professional care

## Boundaries and Limitations
- Do not attempt to diagnose specific conditions definitively
- Do not prescribe specific medications or dosages
- Do not make promises about treatment outcomes
- Do not contradict established medical consensus
- Do not provide emergency medical advice (always direct to emergency services)
- Do not claim to replace professional medical care

## Topic Handling

### Appropriate Topics
- General health information and education
- Explanation of common medical conditions and treatments
- General wellness and preventative health advice
- Understanding medical terminology and procedures
- Information about healthy lifestyle choices

### Topics Requiring Caution
- Mental health concerns (always encourage professional help)
- Chronic condition management (emphasize professional guidance)
- Medication information (provide general info only, not specific recommendations)
- Pregnancy and childcare (provide general info but emphasize professional care)`;

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
    
    let userHealthInfo = "";
    let previousMessages = [];
    
    // For personal doctor, fetch user data and chat history
    if (doctorType === 'personal') {
      try {
        const { db } = await connectToDatabase();
        const userData = await db.collection('users').findOne({ userId });
        
        if (userData) {
          // Format health data
          if (userData.healthData) {
            userHealthInfo = "User Health Information:\n";
            if (userData.healthData.age) userHealthInfo += `- Age: ${userData.healthData.age}\n`;
            if (userData.healthData.gender) userHealthInfo += `- Gender: ${userData.healthData.gender}\n`;
            if (userData.healthData.conditions?.length) userHealthInfo += `- Medical conditions: ${userData.healthData.conditions.join(', ')}\n`;
            if (userData.healthData.medications?.length) userHealthInfo += `- Medications: ${userData.healthData.medications.join(', ')}\n`;
            if (userData.healthData.allergies?.length) userHealthInfo += `- Allergies: ${userData.healthData.allergies.join(', ')}\n`;
          }
          
          // Get last 10 messages for context
          if (userData.chatHistory && userData.chatHistory.length > 0) {
            previousMessages = userData.chatHistory
              .slice(-10)
              .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
              }));
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even with database error - we'll just have less context
      }
    }
    
    try {
      // Get the Gemini model
      const model = genAI.getGenerativeModel({
        model: "gemini-pro", // Use gemini-1.5-pro or gemini-2.0-flash in production
        systemInstruction: AI_DOCTOR_INSTRUCTIONS
      });
      
      // Prepare the chat
      const chat = model.startChat({
        history: previousMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });
      
      // Add context about the mode and user health data if available
      let contextPrompt = `[Doctor Type: ${doctorType === 'personal' ? 'Personal AI Doctor' : 'General AI Doctor'}]\n`;
      if (userHealthInfo) {
        contextPrompt += userHealthInfo + "\n";
      }
      contextPrompt += `User query: ${message}`;
      
      console.log(`Processing ${doctorType} doctor request`);
      
      // Generate response
      const result = await chat.sendMessage(contextPrompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      console.log("Successfully generated AI doctor response using Gemini API");
      
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
    } catch (aiError) {
      console.error('AI error:', aiError);
      return NextResponse.json(
        { message: 'Error generating AI response. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { message: 'Error processing your request' },
      { status: 500 }
    );
  }
} 