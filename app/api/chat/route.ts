// app/api/chat/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface ChatMessage {
  from: 'ai' | 'user';
  text: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

// Helper function to format card data cleanly for the AI prompt
const formatCardForPrompt = (card: any) => {
    const rewardDetails = Object.entries(card.reward_rates || {})
    .map(([key, value]: [string, any]) => `  - ${key.replace(/_/g, ' ')}: ${value.rate}${value.type.includes('%') ? '%' : 'x'} (${value.notes})`)
    .join('\n');

  return `
Card Name: ${card.card_name}
Issuer: ${card.issuer}
Suitability: ${card.suitability}
Benefits Summary: ${card.benefits || card.welcome_benefits}
Reward Rates:
${rewardDetails}
`;
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages }: ChatRequestBody = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const { data: userCards, error: dbError } = await supabase
      .from('user_owned_cards')
      .select('cards(*)')
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json({ error: 'Could not fetch user cards.' }, { status: 500 });
    }

    const cardsInfo = userCards?.map(c => c.cards).map(formatCardForPrompt).join('\n---\n') || "The user has not added any cards to their wallet yet.";

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

    const geminiResult = await geminiResponse.json();
    
    const responseText = geminiResult.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply: responseText });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
