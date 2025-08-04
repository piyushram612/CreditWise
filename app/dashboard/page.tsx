import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

// Define a more specific type for the data we expect from the query,
// aligning with the project brief's schema.
type UserCardFromDB = Database['public']['Tables']['user_owned_cards']['Row'] & {
  cards: Database['public']['Tables']['cards']['Row'] | null;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // FIX: Query the correct 'user_owned_cards' table and join with 'cards'
  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_owned_cards')
    .select(`*, cards(*)`)
    .eq('user_id', session.user.id);

  // Fetch all master cards from the 'cards' table for the "Add Card" modal
  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
  }

  // FIX: Correctly map the data from the joined tables without using 'any'
  const initialUserCards: Card[] = (userCardsData as UserCardFromDB[] || []).map((item) => {
      const cardDetails = item.cards;
      return {
          id: item.id,
          user_id: item.user_id,
          card_id: item.card_id,
          credit_limit: item.credit_limit,
          used_amount: item.used_amount,
          card_name: item.card_name || cardDetails?.card_name,
          card_issuer: item.issuer || cardDetails?.issuer,
          benefits: item.benefits || cardDetails?.benefits,
          fees: item.fees || cardDetails?.fees,
      };
  }).filter((c): c is Card => c !== null);

  const allMasterCards: Card[] = (allCardsData || []).map(card => ({
      id: card.id,
      user_id: '', // Not applicable for master list
      card_name: card.card_name,
      card_issuer: card.issuer,
      benefits: card.benefits,
      fees: card.fees,
  }));

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
