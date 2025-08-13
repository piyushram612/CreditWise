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
    // Skip rate limiting and auth for now - just test the core functionality
    console.log('Skipping rate limiting and auth for debugging...');

    // Parse request body
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

    // Test if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment');
      return NextResponse.json({ 
        error: 'AI service not configured.',
        details: 'GEMINI_API_KEY not found',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('GEMINI_API_KEY found, length:', process.env.GEMINI_API_KEY.length);

    // Use the same approach as the working chat API
    console.log('Using direct Gemini API call (same as chat API)...');
    try {
      const prompt = `
        You are a credit card optimization expert in India. Given a list of credit cards a user owns and a specific spend, your task is to recommend the best card to use for that transaction.
        
        User's Cards (JSON format):
        ${JSON.stringify(cards, null, 2)}
        
        Spend Details (JSON format):
        ${JSON.stringify(spend, null, 2)}
        
        Your recommendation should be concise, clear, and provide a strong justification based on the rewards, benefits, and current utilization of the cards. Consider factors like reward rates for the spend category, ongoing offers (if any are implied by the vendor), and the available credit limit. Format your response in Markdown.
      `;

      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      console.log('Calling Gemini API directly...');
      const geminiResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', errorText);
        return NextResponse.json({ 
          error: 'Failed to get a response from the AI model.',
          details: errorText,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      const geminiResult = await geminiResponse.json();
      console.log('Gemini API response received');

      // Safely access the response text (same as chat API)
      const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        return NextResponse.json({ 
          error: 'AI model returned an invalid response format.',
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

      console.log('AI optimization response received, length:', responseText.length);
      return NextResponse.json({ 
        recommendation: responseText,
        debug: {
          cardsCount: cards.length,
          spendAmount: spend.amount,
          spendCategory: spend.category,
          responseLength: responseText.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (geminiError) {
      console.error('=== GEMINI API ERROR ===');
      console.error('Gemini error type:', geminiError?.constructor?.name);
      console.error('Gemini error message:', geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error');
      console.error('Gemini error stack:', geminiError instanceof Error ? geminiError.stack : 'No stack trace');
      
      return NextResponse.json({ 
        error: 'AI service error.',
        details: geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error',
        errorType: 'GeminiError',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error('=== GENERAL ERROR in optimization API ===');
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
