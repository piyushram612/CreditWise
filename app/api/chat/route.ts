// app/api/chat/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Explicitly set the runtime to Node.js to support Supabase server-side operations
export const runtime = 'nodejs';

// --- Type Definitions ---
// These types ensure type safety and prevent ESLint errors.
// Ideally, they would live in a shared file (e.g., /lib/types.ts).

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
  const benefits = card.benefits ? Object.entries(card.benefits).map(([key, value]) => `  - ${key}: ${value}`).join('\n') : '  - Not specified';
  const fees = card.fees ? Object.entries(card.fees).map(([key, value]) => `  - ${key}: ${value}`).join('\n') : '  - Not specified';

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
  try {
    // FIX: Await the createClient() call
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages }: ChatRequestBody = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    // Fetch the user's cards from the database
    const { data: userCards, error: dbError } = await supabase
      .from('user_owned_cards')
      .select('*')
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json({ error: 'Could not fetch user cards.' }, { status: 500 });
    }

    // Format the fetched card data for the prompt
    const cardsInfo = userCards?.map(formatCardForPrompt).join('\n---\n') || "The user has not added any cards to their wallet yet.";

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
        return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

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

    return NextResponse.json({ reply: responseText });

  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
