import { NextRequest, NextResponse } from 'next/server';
import { getDetailedCardInfo, findBestCardForMerchant, getMerchantSpecificAdvice } from '@/app/utils/cardKnowledgeBase';

interface UserCard {
  id: string;
  card_name: string | null;
  issuer: string | null;
  credit_limit: number | null;
  used_amount: number | null;
  [key: string]: unknown;
}



export async function POST(req: NextRequest) {
  console.log('=== Optimize API called ===');

  try {
    // Skip rate limiting and auth for now - just test the core functionality
    console.log('Skipping rate limiting and auth for debugging...');

    // Parse request body
    console.log('Parsing request body...');
    const body = await req.json();
    console.log('Request body received:', {
      hasCards: !!body.cards,
      cardsCount: body.cards?.length || 0,
      hasSpend: !!body.spend,
      spendAmount: body.spend?.amount,
      spendCategory: body.spend?.category
    });

    const { cards, spend } = body;

    if (!cards || !spend) {
      console.log('Missing cards or spend data');
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    console.log(`Processing optimization for ${cards.length} cards and spend of ₹${spend.amount} in ${spend.category}`);

    // Test if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment');
      return NextResponse.json({ 
        error: 'AI service not configured.',
        details: 'GEMINI_API_KEY not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('GEMINI_API_KEY found, length:', process.env.GEMINI_API_KEY.length);

    // Enhanced AI analysis with detailed card knowledge
    console.log('Using enhanced AI analysis with detailed card knowledge...');
    try {
      // First, try to find the best card using our knowledge base
      const merchantSpecificResult = spend.vendor ? 
        findBestCardForMerchant(cards, spend.vendor, spend.category) : null;
      
      // Get detailed information for all user cards
      const enhancedCards = cards.map((card: UserCard) => {
        const detailedInfo = getDetailedCardInfo(card.card_name || "", card.issuer || "");
        return {
          ...card,
          detailedInfo: detailedInfo
        };
      });

      // Get merchant-specific advice
      const merchantAdvice = spend.vendor ? getMerchantSpecificAdvice(spend.vendor, spend.category) : "";

      const prompt = `
        You are a credit card optimization expert in India with access to real-time card partnership information. Given a list of credit cards a user owns and a specific spend, recommend the best card to use.

        IMPORTANT CONTEXT:
        ${merchantAdvice ? `MERCHANT-SPECIFIC INSIGHT: ${merchantAdvice}` : ""}
        
        ${merchantSpecificResult ? `
        KNOWLEDGE BASE RECOMMENDATION: 
        Based on current partnerships and reward structures, ${merchantSpecificResult.card.card_name} appears to be the best choice because: ${merchantSpecificResult.reason}
        ` : ""}

        User's Cards with Enhanced Details:
        ${JSON.stringify(enhancedCards, null, 2)}
        
        Spend Details:
        ${JSON.stringify(spend, null, 2)}
        
        ANALYSIS REQUIREMENTS:
        1. Consider specific merchant partnerships (e.g., Tata Neu + BigBasket partnership offers 5% rewards)
        2. Look for category-specific bonuses that match the spend type
        3. Factor in current credit utilization and available limits
        4. Consider any ongoing promotional offers or partnerships
        5. Verify if the recommended card actually exists in the user's wallet

        Your recommendation should be:
        - Specific about reward rates and partnerships
        - Clear about why this card beats others for this transaction
        - Mention any special benefits or offers applicable
        - Format the response in clear, readable Markdown

        If you're recommending based on a specific partnership (like Tata Neu for BigBasket), explicitly mention the partnership and reward rate.
      `;

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      console.log('Calling Gemini API directly...');
      const geminiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', errorText);
        return NextResponse.json({ 
          error: 'Failed to get a response from the AI model.',
          details: errorText,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      const geminiResult = await geminiResponse.json();
      console.log('Gemini API response received');

      // Safely access the response text (same as chat API)
      const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        return NextResponse.json({ 
          error: 'AI model returned an invalid response format.',
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      console.log('AI optimization response received, length:', responseText.length);
      return NextResponse.json({ 
        recommendation: responseText,
        debug: {
          cardsCount: cards.length,
          spendAmount: spend.amount,
          spendCategory: spend.category,
          responseLength: responseText.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (geminiError) {
      console.error('=== GEMINI API ERROR ===');
      console.error('Gemini error type:', geminiError?.constructor?.name);
      console.error('Gemini error message:', geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error');
      console.error('Gemini error stack:', geminiError instanceof Error ? geminiError.stack : 'No stack trace');
      
      return NextResponse.json({ 
        error: 'AI service error.',
        details: geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error',
        errorType: 'GeminiError',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error('=== GENERAL ERROR in optimization API ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to get recommendation.',
      details: errorMessage,
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
