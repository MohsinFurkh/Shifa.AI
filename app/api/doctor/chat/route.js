import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../../lib/mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';
// Updated API key - use environment variable if available or fallback
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAbbalJSTZt-r7RDEG4VGkiwdEduZD04X4';

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

// Function to make a direct API call to generate content
async function generateContentDirect(prompt, contextMessages = []) {
  try {
    // Format the prompt with context if available
    let requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    
    // If we have previous messages, add them to the contents
    if (contextMessages.length > 0) {
      requestBody.contents = [
        ...contextMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ];
    }
    
    console.log("Sending request to Gemini API:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error("Unexpected API response structure:", data);
      throw new Error("Unexpected API response structure");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Direct API call error:", error);
    throw error;
  }
}

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
              .slice(-10);
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue even with database error - we'll just have less context
      }
    }
    
    try {
      // Build prompt with doctor type and health info
      let contextPrompt = `You are an AI Doctor providing health information. 
Doctor Type: ${doctorType === 'personal' ? 'Personal AI Doctor' : 'General AI Doctor'}

`;

      if (userHealthInfo) {
        contextPrompt += userHealthInfo + "\n";
      }
      
      if (doctorType === 'personal') {
        contextPrompt += "As a Personal AI Doctor, remember to reference the user's health information in your response.\n\n";
      } else {
        contextPrompt += "As a General AI Doctor, provide general information without assuming personal health details.\n\n";
      }
      
      contextPrompt += `User query: ${message}

Remember to:
- Clarify you are an AI, not a real doctor
- Avoid making definitive diagnoses
- Be empathetic yet professional
- Use simple language for medical concepts
- Include a disclaimer about seeking professional medical advice`;
      
      console.log(`Processing ${doctorType} doctor request`);
      
      // Generate response using direct API call to gemini-2.0-flash
      const aiResponse = await generateContentDirect(contextPrompt, previousMessages);
      console.log("Successfully generated AI doctor response using Gemini 2.0 Flash");
      
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