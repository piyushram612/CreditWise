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
