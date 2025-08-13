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

    // Always return a mock response for now to test the flow
    const mockResponses = [
      "Thanks for your question! I'm here to help with your credit card queries. This is a test response to verify the chat is working.",
      "I understand you're asking about credit cards. While I'm currently in test mode, I'd be happy to help you with card recommendations, rewards, and benefits once fully configured.",
      "That's a great question about credit cards! I'm designed to help you optimize your card usage and understand benefits. This is a mock response for testing.",
      "I can help you with credit card advice, rewards optimization, and understanding card benefits. This is currently a test response.",
      "Thanks for reaching out! I specialize in Indian credit cards and can help with recommendations, comparisons, and usage tips. This is a test message."
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    console.log('Returning mock response');
    return NextResponse.json({ 
      reply: randomResponse,
      debug: {
        messageCount: messages.length,
        latestMessage: latestMessage.text,
        timestamp: new Date().toISOString()
      }
    });

    // TODO: Uncomment this section when ready to use real AI
    /*
    if (!genAI) {
      console.log('GEMINI_API_KEY not configured');
      return NextResponse.json({ 
        reply: "I'm currently in test mode. Please configure the AI service to get personalized credit card advice."
      });
    }

    const history = messages.map(msg => `${msg.from === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are "CreditWise AI", a helpful and friendly Indian credit card advisor. Your role is to answer user questions about their credit cards.
      
      Here is the current conversation history:
      ${history}
      
      Your Task:
      Based on the conversation history, provide a helpful and concise answer to the user's latest message. Focus on Indian credit cards, rewards, benefits, and usage tips. If you can't answer, say so politely. Do not make up information.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI response received');
    return NextResponse.json({ reply: text });
    */

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
