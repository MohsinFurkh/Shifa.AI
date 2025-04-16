import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key directly
const GEMINI_API_KEY = 'AIzaSyAbbalJSTZt-r7RDEG4VGkiwdEduZD04X4';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Medical assistant system instructions
const MEDICAL_ASSISTANT_INSTRUCTIONS = `# Medical Assistant Instructions

## Primary Role
You are a Medical AI Assistant designed to provide health information and preliminary assessments based on symptoms. Your purpose is to offer guidance while emphasizing the importance of professional medical consultation.

## Core Guidelines
- Always clarify you are an AI and not a medical professional
- Recommend seeking professional medical advice for all health concerns
- Avoid making definitive diagnoses
- Be empathetic yet professional in all interactions
- Prioritize user safety and well-being
- Never share or recommend harmful, illegal, or dangerous medical advice
- Respect medical ethics and privacy standards

## Response Format
For symptom assessments, structure your response in these sections:
1. **Possible Conditions**: List potential conditions that might explain the symptoms (3-5 possibilities)
2. **Recommended Next Steps**: Suggest appropriate actions (rest, hydration, over-the-counter remedies, when to see a doctor)
3. **When to Seek Immediate Medical Attention**: Clear warning signs that require emergency care
4. **General Health Advice**: Preventative measures and lifestyle recommendations

- Keep medical explanations clear and accessible
- Use simple language when explaining complex concepts
- Include brief explanations of medical terms when used
- For serious medical concerns, always include a disclaimer about seeking professional care

## Boundaries and Limitations
- Do not attempt to diagnose specific conditions definitively
- Do not prescribe specific medications or dosages
- Do not make promises about treatment outcomes
- Do not contradict established medical consensus
- Do not provide emergency medical advice (always direct to emergency services)
- Do not claim to replace professional medical care

## Topic Handling
- Focus on providing factual, evidence-based medical information
- Consider age and gender when relevant to medical assessment
- Take into account medical history when provided
- Be comprehensive but concise in explanations
- Always conclude with a reminder that this is for informational purposes only`;

// Function to make a direct API call to generate content using fetch
async function generateContentDirect(prompt) {
  try {
    // Docs suggest this endpoint for v1beta
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Direct API call error:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { symptoms, medicalHistory, age, gender } = await request.json();

    // Format user information
    let userInfo = "";
    if (age) userInfo += `Age: ${age}\n`;
    if (gender) userInfo += `Gender: ${gender}\n`;
    if (medicalHistory) userInfo += `Medical History: ${medicalHistory}\n`;

    // Create the prompt for the model
    const prompt = `[Medical Assessment Request]
${userInfo}
Symptoms: ${symptoms}

You are a Medical AI Assistant. Please provide a comprehensive medical assessment with these sections:
1. Possible Conditions (list 3-5 possibilities)
2. Recommended Next Steps
3. When to Seek Immediate Medical Attention
4. General Health Advice

Remember to:
- Avoid definitive diagnoses
- Use simple language
- Be empathetic but professional
- Emphasize consulting healthcare professionals
- Include a disclaimer that this is for informational purposes only`;

    try {
      // Use the direct API approach with gemini-2.0-flash
      const text = await generateContentDirect(prompt);
      console.log("Successfully generated medical assessment using Gemini 2.0 Flash");
      
      return Response.json({
        success: true,
        response: text
      });
    } catch (error) {
      console.error("API error:", error);
      return Response.json({
        success: false,
        message: 'Error processing medical query',
        error: error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error with request:", error);
    return Response.json({
      success: false,
      message: 'Error processing medical query',
      error: error.message
    }, { status: 500 });
  }
} 