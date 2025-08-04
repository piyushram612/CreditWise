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
import type { Database } from '@/lib/database.types';

interface DashboardClientProps {
  user: User;
  initialUserCards: Card[];
  allMasterCards: Card[];
}

export default function DashboardClient({ user, initialUserCards, allMasterCards }: DashboardClientProps) {
  const [cards, setCards] = useState(initialUserCards);
  const [activeView, setActiveView] = useState('optimizer');
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  const handleCardUpdate = useCallback(async () => {
    // FIX: The table name is 'user_cards', not 'user_owned_cards'.
    // We also need to join with 'card_details' to get all card info.
    const { data, error } = await supabase
      .from('user_cards')
      .select(`
        *,
        card_details (*)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      // FIX: Map the data from the joined tables to the 'Card' type.
      const formattedCards: Card[] = data.map((item) => {
        const cardDetails = item.card_details;

        // Handle cases where the join might not return details.
        if (!cardDetails) {
          return null;
        }

        return {
          id: item.id.toString(),
          user_id: item.user_id,
          card_id: item.card_details_id.toString(),
          credit_limit: item.credit_limit,
          used_amount: item.amount_used,
          card_name: cardDetails.card_name,
          card_issuer: cardDetails.issuer,
          // Cast to any for benefits/fees if their structure is not strictly defined in the base type
          benefits: (cardDetails as any).benefits ?? null,
          fees: (cardDetails as any).fees ?? null,
        };
      }).filter((c): c is Card => c !== null); // Filter out any null entries

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
