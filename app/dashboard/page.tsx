import { createClient } from '@/lib/supabase/server';
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
      benefits: item.benefits || null, // Use user's benefits (Json) not template benefits (string)
      fees: item.fees || null,
      // Add template fields if available
      network: item.cards?.network || null,
      annual_fee: item.cards?.annual_fee || null,
      reward_rates: item.cards?.reward_rates || null,
      card_type: item.cards?.card_type || null,
      joining_fee: item.cards?.joining_fee || null,
      fee_waiver: item.cards?.fee_waiver || null,
      welcome_benefits: item.cards?.welcome_benefits || null,
      milestone_benefits: item.cards?.milestone_benefits || null,
      lounge_access: item.cards?.lounge_access || null,
      other_benefits: item.cards?.other_benefits || null,
      suitability: item.cards?.suitability || null,
  }));

  const allMasterCards: Card[] = (allCardsData || []).map(card => ({
      id: card.id,
      user_id: '',
      card_id: card.id,
      card_name: card.card_name,
      issuer: card.issuer,
      benefits: null, // Template cards don't have user-specific benefits
      fees: null, // Template cards don't have user-specific fees
      credit_limit: null,
      used_amount: null,
      // Include template-specific fields
      network: card.network,
      annual_fee: card.annual_fee,
      reward_rates: card.reward_rates,
      card_type: card.card_type,
      joining_fee: card.joining_fee,
      fee_waiver: card.fee_waiver,
      welcome_benefits: card.welcome_benefits,
      milestone_benefits: card.milestone_benefits,
      lounge_access: card.lounge_access,
      other_benefits: card.other_benefits,
      suitability: card.suitability,
  }));

  return (
    <DashboardClient 
      user={session.user}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
