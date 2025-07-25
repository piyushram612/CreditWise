// app/api/optimize/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Explicitly set the runtime to Node.js to support Supabase server-side operations
export const runtime = 'nodejs';

// --- Type Definitions ---
// These types ensure type safety and prevent ESLint errors.

interface UserOwnedCard {
    id: string;
    credit_limit?: number;
    card_name: string;
    issuer: string;
    card_type?: string;
    benefits?: Record<string, string>;
    fees?: Record<string, string>;
}

interface OptimizeRequestBody {
  amount: string;
  category: string;
}

// Defines the expected structure of the JSON response from the Gemini API
interface OptimizationResult {
  bestCard: {
    name: string;
    issuer: string;
  };
  reason: string;
  alternatives: {
    name: string;
    reason: string;
  }[];
}

// Defines the expected structure of the raw Gemini API response
interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string;
            }[];
        };
    }[];
}

const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    bestCard: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        issuer: { type: "STRING" },
      },
      required: ["name", "issuer"]
    },
    reason: { type: "STRING" },
    alternatives: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          reason: { type: "STRING" },
        },
        required: ["name", "reason"]
      },
    },
  },
  required: ["bestCard", "reason", "alternatives"]
};

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
 * API route handler for the Spend Optimizer.
 * It takes a spend amount and category, fetches user card data,
 * and calls the Gemini API to get a structured JSON recommendation.
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, category }: OptimizeRequestBody = await request.json();
    if (!amount || !category) {
        return NextResponse.json({ error: 'Amount and category are required.' }, { status: 400 });
    }

    const { data: userCards, error: dbError } = await supabase
      .from('user_owned_cards')
      .select('*') 
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json({ error: 'Could not fetch user cards.' }, { status: 500 });
    }

    if (!userCards || userCards.length === 0) {
      return NextResponse.json({ error: 'You have no cards in your wallet to optimize.' }, { status: 400 });
    }

    const cardsInfo = userCards.map(formatCardForPrompt).join('\n---\n');

    const prompt = `
      You are an expert Indian credit card advisor. A user wants to make a purchase and needs you to recommend the best card from their wallet.

      User's Purchase Details:
      - Amount: ₹${amount}
      - Category: ${category}

      Here is the user's wallet of available cards:
      ${cardsInfo}

      Your Task:
      1. Analyze the user's cards and their benefits.
      2. Determine which card offers the absolute best value for this specific purchase.
      3. Provide a concise reason for your choice.
      4. Suggest one or two other good alternatives if they exist.
      5. You MUST respond in a valid JSON format that adheres to the provided schema. Do not include any text outside of the JSON structure.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: "application/json",
        response_schema: GEMINI_RESPONSE_SCHEMA,
      },
    };

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
    
    const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
        return NextResponse.json({ error: 'AI model returned an invalid response format.' }, { status: 500 });
    }

    const parsedResponse: OptimizationResult = JSON.parse(responseText);

    return NextResponse.json(parsedResponse);

  } catch (error: unknown) { // Use 'unknown' for better type safety
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
