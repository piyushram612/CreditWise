import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import type { Database } from '@/lib/database.types';

// Initialize the Gemini AI model
// Ensure your GEMINI_API_KEY is set in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Initialize Upstash Ratelimit
const ratelimit = new Ratelimit({
  redis: kv,
  // Allow 5 requests from the same IP within a 10-second window
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function POST(req: NextRequest) {
  // 1. Apply Rate Limiting
  // Get the IP address of the user from the request headers
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  // If the user has exceeded the rate limit, return a 429 error
  if (!success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  // 2. Check Authentication using the modern @supabase/ssr package
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get the user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session is found, the user is not authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Proceed with the core logic
  try {
    // Parse the request body to get the user's cards and spend details
    const { cards, spend } = await req.json();

    // Validate that the required data is present
    if (!cards || !spend) {
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construct the detailed prompt for the AI
    const prompt = `
      You are a credit card optimization expert in India. Given a list of credit cards a user owns and a specific spend, your task is to recommend the best card to use for that transaction.

      User's Cards (JSON format):
      ${JSON.stringify(cards, null, 2)}

      Spend Details (JSON format):
      ${JSON.stringify(spend, null, 2)}

      Your recommendation should be concise, clear, and provide a strong justification based on the rewards, benefits, and current utilization of the cards. Consider factors like reward rates for the spend category, ongoing offers (if any are implied by the vendor), and the available credit limit. Format your response in Markdown.
    `;

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return the AI's recommendation
    return NextResponse.json({ recommendation: text });

  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error in optimization API:', error);
    // Return a generic error message to the client
    return NextResponse.json({ error: 'Failed to get recommendation.' }, { status: 500 });
  }
}
