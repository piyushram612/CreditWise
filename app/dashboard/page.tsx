import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // Fetch the user's owned cards
  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_owned_cards')
    .select('*')
    .eq('user_id', session.user.id);

  // Fetch all master cards from the 'cards' table for the "Add Card" modal
  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
    // Optionally, render an error state
  }

  const initialUserCards: Card[] = userCardsData || [];
  const allMasterCards: Card[] = allCardsData || [];

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
