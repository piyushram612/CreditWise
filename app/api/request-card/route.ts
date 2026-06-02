import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/ratelimit';
import { getClientIdentifier, sanitizeInput } from '@/lib/security';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id);
    const rateLimitResult = await checkRateLimit(identifier);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.reset 
        }, 
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

    const { cardName } = await request.json();
    if (!cardName) {
      return NextResponse.json({ error: 'Card name is required.' }, { status: 400 });
    }

    // Sanitize input
    const sanitizedCardName = sanitizeInput(cardName, 200);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('card_requests')
      .insert({ card_name: sanitizedCardName, user_id: user.id });

    if (error) {
      return NextResponse.json({ error: 'Failed to submit card request.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Thank you! Your request has been submitted.' });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
