'use client';

import { useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Sidebar from './Sidebar';
import CardList from './CardList';
import SpendOptimizer from './SpendOptimizer';
import AiCardAdvisor from './AiCardAdvisor';
import Settings from './Settings';
import { SmartTipsView } from '@/app/components/insights/SmartTipsView';
import type { Card } from '@/lib/types';
import type { Database } from '@/lib/database.types';

interface DashboardClientProps {
  user: User;
  initialUserCards: Card[];
  allMasterCards: Card[];
}

export default function DashboardClient({ user, initialUserCards, allMasterCards }: DashboardClientProps) {
  const [cards, setCards] = useState(initialUserCards);
  const [activeView, setActiveView] = useState('optimizer');
  
  const isDemo = user.id === 'demo-guest-user-id';
  const [showDemoBanner, setShowDemoBanner] = useState(isDemo);

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const handleCardUpdate = useCallback(async () => {
    if (isDemo) return;

    const { data, error } = await supabase
      .from('user_owned_cards')
      .select(`*, cards(*)`)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedCards: Card[] = (data as any[]).map((item) => ({
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

      setCards(formattedCards);
    }
  }, [supabase, user.id, isDemo]);

  const handleLogout = async () => {
    if (isDemo) {
      router.push('/');
      return;
    }
    await supabase.auth.signOut();
    router.push('/');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'optimizer':
        return <SpendOptimizer cards={cards} />;
      case 'tips':
        return <SmartTipsView user={user} />;
      case 'chat':
        return <AiCardAdvisor cards={cards} />;
      case 'settings':
        return <Settings />;
      default:
        return <SpendOptimizer cards={cards} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        {showDemoBanner && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-md mb-6 flex justify-between items-center transition-all duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded uppercase">Demo Mode</span>
              <p className="text-sm font-medium">You&apos;re in demo mode — sign up to save your cards.</p>
            </div>
            <button 
              onClick={() => setShowDemoBanner(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-full overflow-y-auto pr-1">
            {renderActiveView()}
          </div>
          <div className="h-full overflow-y-auto pr-1">
            <CardList 
              cards={cards}
              allCards={allMasterCards}
              onCardUpdate={handleCardUpdate}
              isDemo={isDemo}
              setCards={setCards}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
