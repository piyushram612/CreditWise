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
import type { Card } from '@/lib/types';
// FIX: The 'Tables' type is not a direct export. We only need to import 'Database'.
import type { Database } from '@/lib/database.types';

interface DashboardClientProps {
  user: User;
  initialUserCards: Card[];
  allMasterCards: Card[];
}

export default function DashboardClient({ user, initialUserCards, allMasterCards }: DashboardClientProps) {
  const [cards, setCards] = useState(initialUserCards);
  const [activeView, setActiveView] = useState('optimizer');
  
  const supabase = createBrowserClient<Database>();
  const router = useRouter();

  const handleCardUpdate = useCallback(async () => {
    const { data, error } = await supabase
      .from('user_owned_cards')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      // FIX: Use the correctly nested type for the database row.
      const formattedCards: Card[] = data.map((card: Database['public']['Tables']['user_owned_cards']['Row']) => ({
        id: card.id,
        user_id: card.user_id,
        card_id: card.card_id,
        credit_limit: card.credit_limit,
        card_name: card.card_name,
        card_issuer: card.issuer,
        benefits: card.benefits,
        fees: card.fees,
        used_amount: card.used_amount,
      }));
      setCards(formattedCards);
    }
  }, [supabase, user.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'optimizer':
        return <SpendOptimizer cards={cards} />;
      case 'chat':
        return <AiCardAdvisor cards={cards} />;
      case 'settings':
        return <Settings />;
      default:
        return <SpendOptimizer cards={cards} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {renderActiveView()}
          </div>
          <div className="space-y-6">
            <CardList 
              initialCards={cards}
              allCards={allMasterCards}
              onCardUpdate={handleCardUpdate}
            />
            <Settings />
          </div>
        </div>
      </main>
    </div>
  );
}
