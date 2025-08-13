import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rate limiting - with fallback for development
let ratelimit: { limit: (ip: string) => Promise<{ success: boolean }> } | null = null;

// Try to initialize rate limiting
async function initRateLimit() {
  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { kv } = await import('@vercel/kv');
    
    ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(5, '10 s'),
    });
    console.log('Rate limiting initialized');
  } catch (error) {
    console.warn('Rate limiting not available (this is normal in development):', error);
  }
}

// Initialize rate limiting
initRateLimit();

export async function POST(req: NextRequest) {
  console.log('=== Optimize API called ===');

  try {
    // 1. Check Rate Limiting (skip if not available)
    if (ratelimit) {
      console.log('Checking rate limit...');
      try {
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          console.log('Rate limit exceeded');
          return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
        }
        console.log('Rate limit check passed');
      } catch (rateLimitError) {
        console.warn('Rate limit check failed, continuing:', rateLimitError);
      }
    } else {
      console.log('Rate limiting not available, skipping');
    }

    // 2. Check Authentication (skip for native app compatibility)
    console.log('Checking authentication...');
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('User authenticated:', session.user.id);
      } else {
        console.log('No session found, but continuing for native app compatibility');
      }
    } catch (authError) {
      console.warn('Auth check failed, continuing anyway:', authError);
    }

    // 3. Parse request body
    console.log('Parsing request body...');
    const body = await req.json();
    console.log('Request body received:', {
      hasCards: !!body.cards,
      cardsCount: body.cards?.length || 0,
      hasSpend: !!body.spend,
      spendAmount: body.spend?.amount,
      spendCategory: body.spend?.category
    });

    const { cards, spend } = body;

    if (!cards || !spend) {
      console.log('Missing cards or spend data');
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    console.log(`Processing optimization for ${cards.length} cards and spend of ₹${spend.amount} in ${spend.category}`);

    // 4. Call Gemini AI
    console.log('Initializing Gemini AI...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      You are a credit card optimization expert in India. Given a list of credit cards a user owns and a specific spend, your task is to recommend the best card to use for that transaction.
      
      User's Cards (JSON format):
      ${JSON.stringify(cards, null, 2)}
      
      Spend Details (JSON format):
      ${JSON.stringify(spend, null, 2)}
      
      Your recommendation should be concise, clear, and provide a strong justification based on the rewards, benefits, and current utilization of the cards. Consider factors like reward rates for the spend category, ongoing offers (if any are implied by the vendor), and the available credit limit. Format your response in Markdown.
    `;

    console.log('Calling Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI optimization response received, length:', text.length);
    return NextResponse.json({ 
      recommendation: text,
      debug: {
        cardsCount: cards.length,
        spendAmount: spend.amount,
        spendCategory: spend.category,
        responseLength: text.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('=== ERROR in optimization API ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Failed to get recommendation.',
      details: errorMessage,
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
