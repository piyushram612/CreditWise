import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rate limiting - with fallback for development
let ratelimit: Ratelimit | null = null;
try {
  ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
  });
} catch (error) {
  console.warn('Rate limiting not available:', error);
}

export async function POST(req: NextRequest) {
  console.log('Optimize API called');

  try {
    // 1. Check Rate Limiting (skip if not available)
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
      }
    }

    // 2. Check Authentication (skip for native app compatibility)
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No session found, but continuing for native app compatibility');
        // Don't return error - allow unauthenticated requests for native app
      }
    } catch (authError) {
      console.warn('Auth check failed, continuing anyway:', authError);
    }

    // 3. Proceed with optimization logic
    const body = await req.json();
    console.log('Request body:', body);

    const { cards, spend } = body;

    if (!cards || !spend) {
      console.log('Missing cards or spend data');
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    console.log(`Processing request for ${cards.length} cards and spend of ₹${spend.amount} in ${spend.category}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are a credit card optimization expert in India. Given a list of credit cards a user owns and a specific spend, your task is to recommend the best card to use for that transaction.
      
      User's Cards (JSON format):
      ${JSON.stringify(cards, null, 2)}
      
      Spend Details (JSON format):
      ${JSON.stringify(spend, null, 2)}
      
      Your recommendation should be concise, clear, and provide a strong justification based on the rewards, benefits, and current utilization of the cards. Consider factors like reward rates for the spend category, ongoing offers (if any are implied by the vendor), and the available credit limit. Format your response in Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI optimization response received');
    return NextResponse.json({ 
      recommendation: text,
      debug: {
        cardsCount: cards.length,
        spendAmount: spend.amount,
        spendCategory: spend.category,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in optimization API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to get recommendation.',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
