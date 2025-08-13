import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI only if API key is available
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

interface UserCard {
  card_name: string | null;
  issuer: string | null;
  credit_limit: number | null;
  used_amount: number | null;
  benefits: unknown;
  fees: unknown;
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

    if (!genAI) {
      console.log('GEMINI_API_KEY not configured, returning fallback recommendation');
      const fallbackRecommendation = `Based on your ${cards.length} card(s) and spend of ₹${spend.amount} in ${spend.category}${spend.vendor ? ` at ${spend.vendor}` : ''}, here's a general recommendation:

For ${spend.category} purchases, consider using a card that offers good rewards for this category. Look for cards with:
- Higher reward rates for ${spend.category}
- Lower fees relative to your spend amount
- Available credit limit

To get personalized AI recommendations, please configure the AI service in your environment settings.`;

      return NextResponse.json({ 
        recommendation: fallbackRecommendation,
        debug: {
          cardsCount: cards.length,
          spendAmount: spend.amount,
          spendCategory: spend.category,
          aiConfigured: false,
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log('Using Gemini AI for optimization...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Create a cleaner card summary for the AI
    const cardSummary = cards.map((card: UserCard) => ({
      name: card.card_name,
      issuer: card.issuer,
      creditLimit: card.credit_limit,
      usedAmount: card.used_amount,
      availableCredit: card.credit_limit && card.used_amount ? card.credit_limit - card.used_amount : null,
      benefits: card.benefits,
      fees: card.fees
    }));

    const prompt = `
      You are a credit card optimization expert for Indian credit cards. Analyze the user's cards and recommend the best one for their specific spend.
      
      User's Cards:
      ${JSON.stringify(cardSummary, null, 2)}
      
      Spend Details:
      - Amount: ₹${spend.amount}
      - Category: ${spend.category}
      - Vendor: ${spend.vendor || 'Not specified'}
      
      Instructions:
      1. Recommend the BEST card from their collection for this specific spend
      2. Explain WHY this card is the best choice (rewards, benefits, etc.)
      3. Consider reward rates, fees, credit utilization, and category bonuses
      4. Keep response concise but informative (3-4 sentences)
      5. If all cards are similar, pick one and explain the reasoning
      
      Format your response as plain text, not markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI optimization response received');
    return NextResponse.json({ 
      recommendation: text,
      debug: {
        cardsCount: cards.length,
        spendAmount: spend.amount,
        spendCategory: spend.category,
        aiConfigured: true,
        timestamp: new Date().toISOString()
      }
    });

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
