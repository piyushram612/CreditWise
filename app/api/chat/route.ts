import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'nodejs';

// --- Type Definitions ---
interface UserOwnedCard {
    id: string;
    credit_limit?: number;
    card_name: string;
    issuer: string;
    card_type?: string;
    benefits?: Record<string, any>;
    fees?: Record<string, any>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  cards: UserOwnedCard[];
}

const formatCardForPrompt = (card: UserOwnedCard): string => {
  const benefits = card.benefits ? Object.entries(card.benefits).map(([key, value]) => `  - ${key}: ${JSON.stringify(value)}`).join('\n') : '  - Not specified';
  const fees = card.fees ? Object.entries(card.fees).map(([key, value]) => `  - ${key}: ${JSON.stringify(value)}`).join('\n') : '  - Not specified';

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


export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    // FIX: Create the Supabase client locally within the API route
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, cards }: ChatRequestBody = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const cardsInfo = cards?.map(formatCardForPrompt).join('\n---\n') || "The user has not added any cards to their wallet yet.";
    const history = messages.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
