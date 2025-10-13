import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getDetailedCardInfo } from '@/app/utils/cardKnowledgeBase';
import { getCardOptimizationTips } from '@/app/utils/cardOptimizationDatabase';
import type { UserOwnedCard } from '@/app/types';

// Explicitly set the runtime to Node.js to support Supabase server-side operations
export const runtime = 'nodejs';

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

// Defines the expected structure of the response from the Gemini API
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Formats a user's card details into a string for the AI prompt with enhanced information.
 * @param card - The user-owned card object.
 * @returns A formatted string detailing the card's properties.
 */
const formatCardForPrompt = (card: UserOwnedCard): string => {
  const benefits = card.benefits
    ? Object.entries(card.benefits)
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join('\n')
    : '  - Not specified';

  const fees = card.fees
    ? Object.entries(card.fees)
      .map(([key, value]) => `  - ${key}: ${value}`)
      .join('\n')
    : '  - Not specified';

  // Get detailed information from knowledge base
  const detailedInfo = getDetailedCardInfo(card.card_name || "", card.issuer || "");

  let enhancedInfo = "";
  if (detailedInfo) {
    enhancedInfo = `
Enhanced Card Information:
  Reward Rates:
${Object.entries(detailedInfo.reward_rates)
        .map(([category, info]) => `    - ${category}: ${info.rate}% ${info.type} (${info.notes})`)
        .join('\n')}
  
  Key Partnerships:
${Object.entries(detailedInfo.partnerships)
        .map(([partner, info]) => `    - ${partner}: ${info.reward_rate}% rewards on ${info.merchants.join(', ')}`)
        .join('\n')}
  
  Best For: ${detailedInfo.suitability}`;
  }

  return `
Card Name: ${card.card_name}
Issuer: ${card.issuer}
Card Type: ${card.card_type || 'N/A'}
Network: ${card.network || 'Not specified'} ${card.network === 'RuPay' ? '(UPI Compatible)' : card.network && card.network !== 'Not specified' ? '(No UPI)' : ''}
Credit Limit: ₹${card.credit_limit?.toLocaleString() || 'Not specified'}
Used Amount: ₹${card.used_amount?.toLocaleString() || '0'}
Available Credit: ₹${card.credit_limit && card.used_amount ? (card.credit_limit - card.used_amount).toLocaleString() : 'Not calculated'}

Basic Benefits:
${benefits}
Fees:
${fees}
${enhancedInfo}
`;
};

/**
 * API route handler for the AI Card Advisor chat.
 * It takes the conversation history, fetches user card data,
 * and calls the Gemini API to get a contextual response.
 */
export async function POST(request: Request) {
  console.log('Chat API called');

  try {
    const { messages }: ChatRequestBody = await request.json();
    console.log('Chat request body:', { messageCount: messages?.length });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    let userCards: UserOwnedCard[] = [];
    let cardsInfo = "The user has not added any cards to their wallet yet.";

    // Try to fetch user cards (skip auth errors for native app compatibility)
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        console.log('User authenticated, fetching cards');
        const { data: fetchedCards, error: dbError } = await supabase
          .from('user_owned_cards')
          .select('id, user_id, card_id, credit_limit, used_amount, card_name, issuer, card_type, benefits, fees')
          .eq('user_id', user.id);

        if (dbError) {
          console.error('Supabase DB Error:', dbError);
        } else if (fetchedCards && fetchedCards.length > 0) {
          userCards = fetchedCards;
          cardsInfo = userCards.map(formatCardForPrompt).join('\n---\n');
          console.log(`Found ${userCards.length} cards for user`);
        }
      } else {
        console.log('No user session found, continuing with general advice');
      }
    } catch (authError) {
      console.warn('Auth/DB error, continuing with general advice:', authError);
    }

    // Format conversation history
    const history = messages.map(msg => `${msg.from === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');

    // Generate detailed optimization advice for user's cards
    let optimizationAdvice = "";
    if (userCards.length > 0) {
      const cardOptimizations = userCards.map(card => {
        const tips = getCardOptimizationTips(card.card_name || "", card.issuer || "");
        if (tips) {
          return `\n**${card.card_name} Optimization:**
- Primary benefit: ${tips.optimization_strategies.primary_benefits[0]}
- Best payment method: ${tips.optimization_strategies.payment_methods.direct_payment.recommended ? 'Direct payment' : 'Use specific app/wallet'}
- Key strategy: ${tips.optimization_strategies.spending_strategies[0]?.strategy || 'Maximize category spends'}
- Pro tip: ${tips.optimization_strategies.pro_tips[0]}`;
        }
        return `\n**${card.card_name}:** General optimization advice available`;
      }).join('\n');

      optimizationAdvice = `\nUSER'S CARD OPTIMIZATION STRATEGIES:${cardOptimizations}`;
    }

    const prompt = `
      You are "CreditWise AI", a friendly and professional Indian credit card advisor. You help users optimize their credit card usage and suggest new cards when needed.
      
      User's Current Cards:
      ${cardsInfo}
      ${optimizationAdvice}
      
      Conversation History:
      ${history}
      
      CARD OPTIMIZATION KNOWLEDGE:
      - IDFC FIRST Power+ HP: 10X points on HP Pay app (5% return), use HP Pay wallet for fuel
      - Tata Neu Infinity: 5% NeuCoins on BigBasket, Tata CLiQ (convert to airline miles)
      - HDFC Infinia: Transfer points to airline partners at 1:1 ratio, use SmartBuy portal for 5X
      - Axis Magnus: 25,000 points = 5,000 airline miles, hit ₹1L monthly milestone for bonus
      - SBI Cashback: 5% on online spends unlimited, load wallets online for offline 5% equivalent
      - ICICI Amazon Pay: 5% on Amazon, 2% on bill payments through Amazon Pay
      - Amex Platinum Travel: 5x points on flights, hotels (transfer to Marriott/Singapore Airlines)
      
      OPTIMIZATION SPECIALTIES:
      - Payment method optimization (direct vs wallet vs app-specific)
      - Milestone and spending strategies
      - Point transfer and redemption optimization
      - Category-specific card usage
      - Annual fee waiver strategies
      
      NETWORK IMPORTANCE:
      - RuPay cards: Can be used for UPI payments (great for small merchants, bill payments)
      - Visa/Mastercard: No UPI support but wider international acceptance
      - American Express: Premium benefits but limited merchant acceptance in India
      
      RESPONSE GUIDELINES:
      1. ONLY answer credit card related questions
      2. For greetings: "Hello! I'm CreditWise AI, your personal credit card advisor. I can help optimize your existing cards or suggest new ones. How can I assist you today?"
      3. For optimization questions: Provide specific, actionable advice with exact reward rates and strategies
      4. For card-specific questions: Give detailed optimization tips including payment methods, apps to use, and pro tips
      5. Keep responses 120-150 words - detailed but concise
      6. Always include specific reward rates and actionable steps
      7. For non-credit card questions: "I'm your credit card advisor! I can help with card optimization, rewards strategies, or new card recommendations. What would you like to know about your cards?"
      
      SPECIAL FOCUS AREAS:
      - How to use specific apps (HP Pay, Amazon Pay, SmartBuy portal)
      - Whether to pay directly or load wallets first
      - Milestone optimization strategies
      - Point transfer timing and ratios
      - Category-specific spending optimization
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('GEMINI_API_KEY not configured');
      return NextResponse.json({
        reply: "I'm here to help with your credit card questions! However, I need to be properly configured with AI services to provide personalized advice. For now, I can suggest checking your card benefits, comparing reward rates, and optimizing your spending categories."
      });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    console.log('Calling Gemini API...');
    // Call the Gemini API
    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: 'Failed to get a response from the AI model.' }, { status: 500 });
    }

    const geminiResult: GeminiResponse = await geminiResponse.json();

    // Safely access the response text
    const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return NextResponse.json({ error: 'AI model returned an invalid response format.' }, { status: 500 });
    }

    console.log('AI response received');
    return NextResponse.json({
      reply: responseText,
      debug: {
        messageCount: messages.length,
        cardsCount: userCards.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
