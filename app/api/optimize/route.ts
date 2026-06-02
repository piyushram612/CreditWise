import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDetailedCardInfo, findBestCardForMerchant, getMerchantSpecificAdvice } from '@/app/utils/cardKnowledgeBase';
import { checkRateLimit } from '@/lib/ratelimit';
import { getClientIdentifier } from '@/lib/security';

interface UserCard {
  id: string;
  card_name: string | null;
  issuer: string | null;
  network: string | null;
  credit_limit: number | null;
  used_amount: number | null;
  [key: string]: unknown;
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limiting
    const identifier = getClientIdentifier(req, user?.id);
    const rateLimitResult = await checkRateLimit(identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const body = await req.json();
    const { cards, spend } = body;

    if (!cards || !spend) {
      return NextResponse.json({ error: 'Missing cards or spend data.' }, { status: 400 });
    }

    // Validate spend amount is a number
    if (typeof spend.amount !== 'number' || spend.amount <= 0) {
      return NextResponse.json({ error: 'Invalid spend amount.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 });
    }

    // First, try to find the best card using our knowledge base
    const merchantSpecificResult = spend.vendor ?
      findBestCardForMerchant(cards, spend.vendor, spend.category) : null;

    // Get detailed information for all user cards
    const enhancedCards = cards.map((card: UserCard) => {
      const detailedInfo = getDetailedCardInfo(card.card_name || "", card.issuer || "");
      return {
        ...card,
        detailedInfo: detailedInfo
      };
    });

    // Get merchant-specific advice
    const merchantAdvice = spend.vendor ? getMerchantSpecificAdvice(spend.vendor) : "";

    const prompt = `
      You are a credit card optimization expert. Analyze the user's existing cards and recommend the BEST card from their wallet for this specific spend.

      CRITICAL RULE: You can ONLY recommend cards that exist in the user's wallet. Do NOT suggest cards they don't own.

      ${merchantAdvice ? `MERCHANT INSIGHT: ${merchantAdvice}` : ""}
      ${merchantSpecificResult ? `KNOWLEDGE BASE: ${merchantSpecificResult.card.card_name} - ${merchantSpecificResult.reason}` : ""}

      User's Available Cards: ${JSON.stringify(enhancedCards, null, 2)}
      Spend: ₹${spend.amount} on ${spend.category}${spend.vendor ? ` at ${spend.vendor}` : ""}
      
      ANALYSIS REQUIREMENTS:
      1. ONLY recommend cards from the user's wallet above
      2. Compare reward rates across their existing cards
      3. Consider milestone benefits and bonus categories
      4. Factor in credit utilization impact
      5. Include point transfer opportunities if applicable
      
      FORMAT:
      ## Best Card: [Card Name from user's wallet]
      **Reward Rate:** [X%/points per ₹100]
      **Why:** [Concise reason - max 2 lines]
      
      ### Pro Tips:
      - [Specific hack/tip for this spend]
      - [Point transfer opportunity if relevant]
      - [Any stacking method]
      
      If no card in their wallet is particularly good for this category, still pick the best available option and explain why.
      Keep total response under 200 words. Be direct and actionable.
    `;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!geminiResponse.ok) {
      return NextResponse.json({ error: 'Failed to get a response from the AI model.' }, { status: 500 });
    }

    const geminiResult = await geminiResponse.json();

    const responseText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return NextResponse.json({ error: 'AI model returned an invalid response format.' }, { status: 500 });
    }

    return NextResponse.json({ recommendation: responseText });

  } catch {
    return NextResponse.json({ error: 'Failed to get recommendation.' }, { status: 500 });
  }
}
