import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert image to byte array
    const imageBytes = await imageFile.arrayBuffer();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Analyze the image with a more structured prompt
    const result = await model.generateContent([
      {
        text: `You are a food analysis AI. Analyze this food image and provide detailed nutritional information.
        Important: You must ONLY return a JSON object in this exact format, with NO additional text or explanations:
        {
          "calories": number,
          "description": string,
          "macros": {
            "protein": number,
            "carbs": number,
            "fat": number,
            "fiber": number
          }
        }
        Rules:
        - calories must be a realistic estimate in kcal (number only)
        - all macro values must be in grams (numbers only)
        - description should be a brief but specific food description
        - DO NOT include any text outside the JSON object
        - DO NOT include markdown code block markers`
      },
      {
        inlineData: {
          mimeType: imageFile.type,
          data: Buffer.from(imageBytes).toString('base64')
        }
      }
    ]);

    const response = await result.response;
    let responseText = response.text().trim();
    // Remove any markdown code block markers if present
    responseText = responseText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    
    console.log('Cleaned AI Response:', responseText); // Debug log

    // Parse the response and validate
    try {
      const data = JSON.parse(responseText);
      
      // Validate the response format
      if (typeof data.calories === 'number' && 
          typeof data.description === 'string' &&
          typeof data.macros?.protein === 'number' &&
          typeof data.macros?.carbs === 'number' &&
          typeof data.macros?.fat === 'number' &&
          typeof data.macros?.fiber === 'number') {
        
        // Return the analyzed data
        return NextResponse.json(data);
      }
      
      console.log('Invalid data format:', data); // Debug log
      throw new Error('Invalid response format');
    } catch (e) {
      console.log('JSON parse or validation failed:', e); // Debug log
      return NextResponse.json(
        { error: 'Failed to analyze food data' },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}