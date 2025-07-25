// app/api/request-card/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cardName } = await request.json();
    if (!cardName) {
      return NextResponse.json({ error: 'Card name is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('card_requests')
      .insert({ card_name: cardName, user_id: user.id });

    if (error) {
      console.error('Supabase Error (Card Request):', error);
      return NextResponse.json({ error: 'Failed to submit card request.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Thank you! Your request has been submitted.' });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
