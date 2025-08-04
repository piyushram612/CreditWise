import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import type { Database } from '@/lib/database.types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { cards, spend } = await req.json();

    if (!cards || !spend) {
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

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

    return NextResponse.json({ recommendation: text });

  } catch (error) {
    console.error('Error in optimization API:', error);
    return NextResponse.json({ error: 'Failed to get recommendation.' }, { status: 500 });
  }
}
