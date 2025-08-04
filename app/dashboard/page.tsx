import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  // Fetch the user's owned cards and join with card details
  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_cards')
    .select(`*, card_details(*)`)
    .eq('user_id', session.user.id);

  // Fetch all master cards from the 'cards' table for the "Add Card" modal
  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
  }

  const initialUserCards: Card[] = (userCardsData || []).map((item: any) => {
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
          benefits: cardDetails.benefits ?? null,
          fees: cardDetails.fees ?? null,
      };
  }).filter((c): c is Card => c !== null);

  const allMasterCards: Card[] = allCardsData || [];

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
