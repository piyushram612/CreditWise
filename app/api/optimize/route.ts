import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI only if API key is available
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req: NextRequest) {
  console.log('Optimize API called');

  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { cards, spend } = body;

    if (!cards || !spend) {
      console.log('Missing cards or spend data');
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    if (!genAI) {
      console.log('GEMINI_API_KEY not configured, returning mock response');
      // Return a mock response if Gemini is not configured
      return NextResponse.json({ 
        recommendation: `Based on your ${cards.length} card(s) and spend of ₹${spend.amount} in ${spend.category}, I recommend using your primary card for this transaction. This is a mock response since AI is not configured.` 
      });
    }

    console.log('Calling Gemini AI...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are a credit card optimization expert in India. Given a list of credit cards a user owns and a specific spend, your task is to recommend the best card to use for that transaction.
      
      User's Cards:
      ${JSON.stringify(cards, null, 2)}
      
      Spend Details:
      ${JSON.stringify(spend, null, 2)}
      
      Your recommendation should be concise, clear, and provide a strong justification based on the rewards, benefits, and current utilization of the cards. Consider factors like reward rates for the spend category, ongoing offers (if any are implied by the vendor), and the available credit limit.
      
      Respond in plain text format (not markdown).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI response received');
    return NextResponse.json({ recommendation: text });

  } catch (error) {
    console.error('Error in optimization API:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to get recommendation.',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
