import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedbackText } = await request.json();
    if (!feedbackText) {
      return NextResponse.json({ error: 'Feedback text is required.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('feedback')
      .insert({ feedback_text: feedbackText, user_id: user.id });

    if (error) {
      console.error('Supabase Error (Feedback):', error);
      return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Thank you for your valuable feedback!' });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
