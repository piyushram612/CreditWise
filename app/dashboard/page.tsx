import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

// Define a more specific type for the data we expect from the query,
// aligning with the actual database.types.ts file.
type UserCardFromDB = Database['public']['Tables']['user_cards']['Row'] & {
  card_details: Database['public']['Tables']['card_details']['Row'] | null;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // FIX: Query the correct 'user_cards' table and join with 'card_details'
  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_cards')
    .select(`*, card_details(*)`)
    .eq('user_id', session.user.id);

  // FIX: Fetch all master cards from the 'card_details' table
  const { data: allCardsData, error: allCardsError } = await supabase
    .from('card_details')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
  }

  // FIX: Correctly map the data from the joined tables
  const initialUserCards: Card[] = (userCardsData as UserCardFromDB[] || []).map((item) => {
      const cardDetails = item.card_details;
      if (!cardDetails) return null;
      return {
          id: item.id.toString(),
          user_id: item.user_id,
          card_id: item.card_details_id.toString(),
          credit_limit: item.credit_limit,
          used_amount: item.amount_used,
          card_name: cardDetails.card_name,
          card_issuer: cardDetails.issuer,
          // These fields may not exist on card_details, so we provide fallbacks
          benefits: (cardDetails as any).benefits ?? null,
          fees: (cardDetails as any).fees ?? null,
      };
  }).filter((c): c is Card => c !== null);

  const allMasterCards: Card[] = (allCardsData || []).map(card => ({
      id: card.id.toString(),
      user_id: '', // Not applicable for master list
      card_name: card.card_name,
      card_issuer: card.issuer,
  }));

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
