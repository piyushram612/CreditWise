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

    console.log(`Processing request for ${cards.length} cards and spend of ₹${spend.amount} in ${spend.category}`);

    // Always return a mock response for now to test the flow
    const mockRecommendation = `Based on your ${cards.length} card(s) and spend of ₹${spend.amount} in ${spend.category}${spend.vendor ? ` at ${spend.vendor}` : ''}, here's my recommendation:

For ${spend.category} purchases, I recommend using your ${cards[0]?.card_name || 'primary card'} as it typically offers good rewards for this category. 

Key considerations:
- Amount: ₹${spend.amount}
- Category: ${spend.category}
- Available cards: ${cards.length}

This is a test response to verify the API is working correctly.`;

    console.log('Returning mock recommendation');
    return NextResponse.json({ 
      recommendation: mockRecommendation,
      debug: {
        cardsCount: cards.length,
        spendAmount: spend.amount,
        spendCategory: spend.category,
        timestamp: new Date().toISOString()
      }
    });

    // TODO: Uncomment this section when ready to use real AI
    /*
    if (!genAI) {
      console.log('GEMINI_API_KEY not configured');
      return NextResponse.json({ 
        recommendation: mockRecommendation
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
    */

  } catch (error) {
    console.error('Error in optimization API:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      error: 'Failed to get recommendation.',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
