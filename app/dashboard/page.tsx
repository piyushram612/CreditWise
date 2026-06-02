import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from '../components/dashboard/DashboardClient';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';
import type { User } from '@supabase/supabase-js';

type UserCardFromDB = Database['public']['Tables']['user_owned_cards']['Row'] & {
  cards: Database['public']['Tables']['cards']['Row'] | null;
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const isDemo = resolvedSearchParams.demo === 'true';

  const supabase = await createClient();
  let sessionUser: User | null = null;
  let userCardsData: UserCardFromDB[] = [];
  let userCardsError = null;

  if (isDemo) {
    sessionUser = {
      id: 'demo-guest-user-id',
      email: 'guest@creditwise.com',
      user_metadata: { full_name: 'Guest User' }
    } as unknown as User;
  } else {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/');
    }
    sessionUser = session.user;

    const { data, error } = await supabase
      .from('user_owned_cards')
      .select(`*, cards(*)`)
      .eq('user_id', sessionUser.id);
    
    userCardsData = data || [];
    userCardsError = error;
  }

  const { data: allCardsData, error: allCardsError } = await supabase
    .from('cards')
    .select('*');

  if (userCardsError || allCardsError) {
  }

  let initialUserCards: Card[] = [];

  if (isDemo) {
    const sampleMasterCards = allCardsData ? allCardsData.slice(0, 3) : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialUserCards = (sampleMasterCards as any[]).map((card, index) => ({
      id: `demo-card-${index}`,
      user_id: 'demo-guest-user-id',
      card_id: card.id,
      credit_limit: 500000,
      used_amount: index === 0 ? 120000 : index === 1 ? 45000 : 0,
      card_name: card.card_name,
      issuer: card.issuer,
      benefits: card.benefits ? { info: card.benefits } : null,
      fees: card.annual_fee ? { "annual_fee": `₹${card.annual_fee}` } : null,
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
  } else {
    initialUserCards = (userCardsData as UserCardFromDB[] || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      card_id: item.card_id,
      credit_limit: item.credit_limit,
      used_amount: item.used_amount,
      card_name: item.card_name || item.cards?.card_name || null,
      issuer: item.issuer || item.cards?.issuer || null,
      benefits: item.benefits || null,
      fees: item.fees || null,
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allMasterCards: Card[] = (((allCardsData as any[]) || [])).map(card => ({
      id: card.id,
      user_id: '',
      card_id: card.id,
      card_name: card.card_name,
      issuer: card.issuer,
      benefits: null,
      fees: null,
      credit_limit: null,
      used_amount: null,
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
      user={sessionUser}
      initialUserCards={initialUserCards}
      allMasterCards={allMasterCards}
    />
  );
}
