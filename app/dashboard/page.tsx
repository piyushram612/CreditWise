import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // Query the correct 'user_owned_cards' table and join with 'cards'
  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_owned_cards')
    .select(`*, cards(*)`)
    .eq('user_id', session.user.id);

  // Fetch all master cards from the 'cards' table
  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
  }

  // The 'userCardsData' now directly matches the 'Card[]' type, so no complex mapping is needed.
  const initialUserCards: Card[] = userCardsData || [];
  const allMasterCards: Card[] = (allCardsData || []).map(card => ({
      ...card,
      id: card.id,
      user_id: '', // Not applicable for master list
      card_id: card.id,
      credit_limit: null,
      used_amount: null,
  }));

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
