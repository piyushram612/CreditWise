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

    // 1. Fetch the user's cards from Supabase to provide context
    const { data: userCards, error: dbError } = await supabase
      .from('user_owned_cards')
      .select('cards(*)')
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Supabase DB Error:', dbError);
      return NextResponse.json({ error: 'Could not fetch user cards.' }, { status: 500 });
    }

    const cardsInfo = userCards?.map(c => c.cards).map(card => 
        `- Card: ${card.card_name}, Issuer: ${card.issuer}, Benefits: ${card.benefits}`
    ).join('\n') || "The user has not added any cards to their wallet yet.";

    // 2. Construct a detailed prompt for the Gemini AI
    const history = messages.map(msg => `${msg.from === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');

    const prompt = `
      You are "CreditWise AI", a helpful and friendly Indian credit card advisor. Your role is to answer user questions about their credit cards.

      Here is the context about the user's current credit card wallet:
      ${cardsInfo}

      Here is the current conversation history:
      ${history}

      Your Task:
      Based on the provided context of the user's cards and the conversation history, provide a helpful and concise answer to the user's latest message. If the user asks a question you can't answer with the given information, say so politely. Do not make up information. Respond as the "AI".
    `;

    // 3. Call the Gemini API
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
    
    // 4. Parse and return the AI's text response
    const responseText = geminiResult.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply: responseText });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
