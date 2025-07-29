'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import Sidebar from '../components/dashboard/Sidebar';
import CardList from '../components/dashboard/CardList';
import SpendOptimizer from '../components/dashboard/SpendOptimizer';
import AiCardAdvisor from '../components/dashboard/AiCardAdvisor';
import Settings from '../components/dashboard/Settings';
import { CreditCardIcon } from '../components/icons';
import type { Card } from '../../lib/types';

// Define a type for the raw data structure from Supabase
interface SupabaseCardData {
  id: number;
  credit_limit: number;
  amount_used: number;
  cards: { // Corrected from card_details
    id: number;
    card_name: string;
    issuer: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('optimizer');
  
  const supabase = createClientComponentClient();
  const router = useRouter();

  const fetchUserCards = useCallback(async (userId: string) => {
    // Corrected table name to 'user_owned_cards' and the join to 'cards(*)'
    const { data, error } = await supabase
      .from('user_owned_cards')
      .select('*, cards(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      const formattedCards: Card[] = data.map((card: SupabaseCardData) => ({
        id: card.id,
        card_name: card.cards.card_name,
        card_issuer: card.cards.issuer,
        credit_limit: card.credit_limit,
        amount_used: card.amount_used,
        card_details_id: card.cards.id,
      }));
      setCards(formattedCards);
    }
  }, [supabase]);

  const fetchAllCards = useCallback(async () => {
    // Corrected table name to 'cards'
    const { data, error } = await supabase.from('cards').select('*');
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
      Promise.all([
        fetchUserCards(user.id),
        fetchAllCards()
      ]).finally(() => setLoading(false));
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
                <span className="text-xl">Loading CreditWise...</span>
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
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 overflow-y-auto">
        <div className="lg:col-span-2">
            {renderActiveView()}
        </div>
        <div className="lg:col-span-1">
          <CardList cards={cards} onCardUpdate={() => user && fetchUserCards(user.id)} allCards={allCards} />
        </div>
      </main>
    </div>
  );
}
