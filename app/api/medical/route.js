import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyAbbalJSTZt-r7RDEG4VGkiwdEduZD04X4');

export async function POST(request) {
  try {
    const { symptoms, medicalHistory, age, gender } = await request.json();

    const prompt = `As a medical AI assistant, please provide a professional assessment based on the following information:
    Symptoms: ${symptoms}
    Medical History: ${medicalHistory}
    Age: ${age}
    Gender: ${gender}
    
    Please provide:
    1. Possible conditions
    2. Recommended next steps
    3. When to seek immediate medical attention
    4. General health advice
    
    Note: This is for informational purposes only and not a substitute for professional medical advice.`;

    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
    });

    // Generate content using the Gemini model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({
      success: true,
      response: text
    });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return Response.json({
      success: false,
      message: 'Error processing medical query',
      error: error.message
    }, { status: 500 });
  }
} 