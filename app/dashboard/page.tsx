import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

type UserCardFromDB = Database['public']['Tables']['user_owned_cards']['Row'] & {
  cards: Database['public']['Tables']['cards']['Row'] | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: userCardsData, error: userCardsError } = await supabase
    .from('user_owned_cards')
    .select(`*, cards(*)`)
    .eq('user_id', session.user.id);

  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
    console.error('Error fetching cards:', userCardsError || allCardsError);
  }

  const initialUserCards: Card[] = (userCardsData as UserCardFromDB[] || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      card_id: item.card_id,
      credit_limit: item.credit_limit,
      used_amount: item.used_amount,
      card_name: item.card_name || item.cards?.card_name || null,
      issuer: item.issuer || item.cards?.issuer || null,
      benefits: item.benefits || item.cards?.benefits || null,
      fees: item.fees || item.cards?.fees || null,
  }));

  const allMasterCards: Card[] = (allCardsData || []).map(card => ({
      id: card.id,
      user_id: '',
      card_id: card.id,
      card_name: card.card_name,
      issuer: card.issuer,
      benefits: card.benefits,
      fees: card.fees,
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
