'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Sidebar from '../components/dashboard/Sidebar';
import CardList from '../components/dashboard/CardList';
import SpendOptimizer from '../components/dashboard/SpendOptimizer';
import AiCardAdvisor from '../components/dashboard/AiCardAdvisor';
import Settings from '../components/dashboard/Settings';
import { CreditCardIcon } from '../components/icons';
import type { Card } from '../../lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('optimizer');
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchUserCards = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_cards')
      .select('*, card_details(*)')
      .eq('user_id', userId);
    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      const formattedCards: Card[] = data.map((card: any) => ({
        id: card.id,
        card_name: card.card_details.card_name,
        card_issuer: card.card_details.issuer,
        credit_limit: card.credit_limit,
        amount_used: card.amount_used,
        card_details_id: card.card_details.id,
      }));
      setCards(formattedCards);
    }
  }, [supabase]);

  const fetchAllCards = useCallback(async () => {
    const { data, error } = await supabase.from('card_details').select('*');
    if (error) console.error('Error fetching all cards:', error);
    else setAllCards(data || []);
  }, [supabase]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
            router.push('/');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    if (user) {
      fetchUserCards(user.id);
      fetchAllCards();
    }
  }, [user, fetchUserCards, fetchAllCards]);

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

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
            <div className="flex items-center space-x-2">
                <CreditCardIcon className="h-8 w-8 animate-pulse" />
                <span className="text-xl">Loading your dashboard...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar 
        user={user} 
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderActiveView()}
        </div>
        <aside className="w-1/3 max-w-sm hidden lg:block bg-gray-950/50 border-l border-gray-800 p-6 overflow-y-auto">
          <CardList cards={cards} onCardUpdate={() => user && fetchUserCards(user.id)} allCards={allCards} />
        </aside>
      </main>
    </div>
  );
}