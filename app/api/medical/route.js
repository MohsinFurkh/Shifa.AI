import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional medical AI assistant. Provide accurate, helpful, and responsible medical information. Always emphasize the importance of consulting healthcare professionals."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return Response.json({
      success: true,
      response: completion.choices[0].message.content
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error processing medical query',
      error: error.message
    }, { status: 500 });
  }
} 