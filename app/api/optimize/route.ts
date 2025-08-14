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
        You are a credit card optimization expert. Analyze the user's existing cards and recommend the BEST card from their wallet for this specific spend.

        CRITICAL RULE: You can ONLY recommend cards that exist in the user's wallet. Do NOT suggest cards they don't own.

        ${merchantAdvice ? `MERCHANT INSIGHT: ${merchantAdvice}` : ""}
        ${merchantSpecificResult ? `KNOWLEDGE BASE: ${merchantSpecificResult.card.card_name} - ${merchantSpecificResult.reason}` : ""}

        User's Available Cards: ${JSON.stringify(enhancedCards, null, 2)}
        Spend: ₹${spend.amount} on ${spend.category}${spend.vendor ? ` at ${spend.vendor}` : ""}
        
        ANALYSIS REQUIREMENTS:
        1. ONLY recommend cards from the user's wallet above
        2. Compare reward rates across their existing cards
        3. Consider milestone benefits and bonus categories
        4. Factor in credit utilization impact
        5. Include point transfer opportunities if applicable
        
        FORMAT:
        ## Best Card: [Card Name from user's wallet]
        **Reward Rate:** [X%/points per ₹100]
        **Why:** [Concise reason - max 2 lines]
        
        ### Pro Tips:
        - [Specific hack/tip for this spend]
        - [Point transfer opportunity if relevant]
        - [Any stacking method]
        
        If no card in their wallet is particularly good for this category, still pick the best available option and explain why.
        Keep total response under 200 words. Be direct and actionable.
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
