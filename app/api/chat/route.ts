import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Json } from '@/lib/types';

// Initialize Gemini AI only if API key is available
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

interface UserOwnedCard {
    id: string;
    credit_limit?: number;
    card_name: string;
    issuer: string;
    card_type?: string;
    benefits?: Json | null;
    fees?: Json | null;
}

interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

export async function POST(request: Request) {
  console.log('Chat API called');

  try {
    const body = await request.json();
    console.log('Chat request body:', body);

    const { messages }: ChatRequestBody = body;
    
    if (!messages || messages.length === 0) {
      console.log('No messages provided');
      return NextResponse.json({ error: 'No messages provided.' }, { status: 400 });
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.from !== 'user') {
      return NextResponse.json({ error: 'Latest message must be from user.' }, { status: 400 });
    }

    console.log('Latest user message:', latestMessage.text);

    if (!genAI) {
      console.log('GEMINI_API_KEY not configured, returning fallback response');
      const fallbackResponse = "I'm here to help with your credit card questions! However, I need to be properly configured with AI services to provide personalized advice. For now, I can suggest checking your card benefits, comparing reward rates, and optimizing your spending categories.";
      
      return NextResponse.json({ 
        reply: fallbackResponse,
        debug: {
          messageCount: messages.length,
          latestMessage: latestMessage.text,
          aiConfigured: false,
          timestamp: new Date().toISOString()
        }
      });
    }

    console.log('Using Gemini AI for response');
    const history = messages.map(msg => `${msg.from === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are "CreditWise AI", a helpful and friendly Indian credit card advisor. Your role is to answer user questions about their credit cards, rewards, benefits, and usage optimization.
      
      Here is the current conversation history:
      ${history}
      
      Guidelines:
      - Focus on Indian credit cards, rewards, benefits, and usage tips
      - Be concise but helpful (2-3 sentences max unless complex topic)
      - If you don't know something specific, say so politely
      - Don't make up specific card details or offers
      - Help with general advice on card categories, reward optimization, and smart usage
      - Be friendly and conversational
      
      Respond to the user's latest message:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI response received');
    return NextResponse.json({ 
      reply: text,
      debug: {
        messageCount: messages.length,
        latestMessage: latestMessage.text,
        aiConfigured: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('Chat API error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      error: 'Failed to get response.',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
