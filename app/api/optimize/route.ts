import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // For now, we'll just return a mock response.
  // In the next step, we'll add the Gemini AI logic here.
  const mockResponse = {
    bestCard: { name: 'HDFC Millennia (from API)', issuer: 'hdfc' },
    reason: "This is a test response from the API. It proves that the frontend is correctly calling the backend.",
    alternatives: [
      { name: 'ICICI Amazon Pay (from API)', reason: "This is a test alternative." }
    ]
  };

  return NextResponse.json(mockResponse);
}
