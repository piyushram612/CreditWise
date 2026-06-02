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
  const [isWalletCollapsed, setIsWalletCollapsed] = useState(false);
  
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
    <div className="flex h-screen bg-[#090B10] text-white overflow-hidden font-sans">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        {/* Main Content Header Utility Row */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {activeView === 'optimizer' ? 'Optimize Your Spend' : activeView === 'tips' ? 'Smart Tips & Hacks' : activeView === 'chat' ? 'AI Card Advisor' : 'Settings'}
          </h1>
          <div className="flex items-center gap-2 text-[#82889A]">
            <button className="p-2 hover:text-white transition-colors hover:bg-gray-800/20 rounded-lg select-none" title="Notifications">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9a6 6 0 00-6-6 6 6 0 00-6 6v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            <button className="p-2 hover:text-white transition-colors hover:bg-gray-800/20 rounded-lg select-none" title="Help">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1E2538] border border-[#2A334B] flex items-center justify-center text-xs font-bold text-blue-400 select-none shadow-sm cursor-pointer ml-1 hover:border-blue-400/50 transition-colors" title={user?.email || 'Guest User'}>
              {user?.email ? user.email.slice(0, 2).toUpperCase() : 'GU'}
            </div>
          </div>
        </div>

        {showDemoBanner && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow-md mb-6 flex justify-between items-center transition-all duration-200 shrink-0">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded uppercase select-none">Demo Mode</span>
              <p className="text-sm font-medium">You&apos;re in demo mode — sign up to save your cards.</p>
            </div>
            <button 
              onClick={() => setShowDemoBanner(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          <div className={`${isWalletCollapsed ? 'lg:col-span-3' : 'lg:col-span-2'} h-full overflow-y-auto pr-1 transition-all duration-300`}>
            {renderActiveView()}
          </div>
          {!isWalletCollapsed && (
            <div className="h-full overflow-y-auto pr-1 transition-all duration-300">
              <CardList 
                cards={cards}
                allCards={allMasterCards}
                onCardUpdate={handleCardUpdate}
                isDemo={isDemo}
                setCards={setCards}
                onCollapseToggle={() => setIsWalletCollapsed(true)}
              />
            </div>
          )}
        </div>

        {/* Floating Expand Wallet Button */}
        {isWalletCollapsed && (
          <button 
            onClick={() => setIsWalletCollapsed(false)}
            className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#131622] border-l border-t border-b border-[#1E2538] hover:border-gray-600/40 text-blue-400 p-2.5 rounded-l-xl shadow-lg transition-all z-40 select-none hover:text-white cursor-pointer"
            title="Expand Wallet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
}
