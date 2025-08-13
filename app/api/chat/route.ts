import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Explicitly set the runtime to Node.js to support Supabase server-side operations
export const runtime = 'nodejs';

// --- Type Definitions ---
interface UserOwnedCard {
  id: string;
  credit_limit?: number;
  card_name: string;
  issuer: string;
  card_type?: string;
  benefits?: Record<string, string>;
  fees?: Record<string, string>;
}

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
 * Formats a user's card details into a string for the AI prompt.
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

  return `
Card Name: ${card.card_name}
Issuer: ${card.issuer}
Card Type: ${card.card_type || 'N/A'}
Benefits:
${benefits}
Fees:
${fees}
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
          .select('*')
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

    const prompt = `
      You are "CreditWise AI", a helpful and friendly Indian credit card advisor. Your role is to answer user questions about their credit cards.
      
      Here is the context about the user's current credit card wallet:
      ---
      ${cardsInfo}
      ---
      
      Here is the current conversation history:
      ${history}
      
      Your Task:
      Based on the provided context of the user's cards and the conversation history, provide a helpful and concise answer to the user's latest message. If the user asks a question you can't answer with the given information, say so politely. Do not make up information. Respond as the "AI".
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('GEMINI_API_KEY not configured');
      return NextResponse.json({ 
        reply: "I'm here to help with your credit card questions! However, I need to be properly configured with AI services to provide personalized advice. For now, I can suggest checking your card benefits, comparing reward rates, and optimizing your spending categories."
      });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
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
