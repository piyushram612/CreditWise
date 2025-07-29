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
import type { Card, Json } from '../../lib/types';

// Define a type for the raw data structure from Supabase
interface SupabaseUserCard {
  id: string;
  user_id: string;
  card_id: string | null;
  credit_limit: number | null;
  created_at: string | null;
  custom_benefits: string | null;
  card_name: string | null;
  issuer: string | null;
  card_type: string | null;
  benefits: Json | null;
  fees: Json | null;
  used_amount: number | null;
  cards: { // This comes from the join
    card_name: string;
    issuer: string;
    benefits: Json | null;
  } | null;
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
    const { data, error } = await supabase
      .from('user_owned_cards')
      .select('*, cards(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user cards:', error);
    } else if (data) {
      const formattedCards: Card[] = data.map((card: SupabaseUserCard) => ({
        id: card.id,
        user_id: card.user_id,
        card_id: card.card_id,
        credit_limit: card.credit_limit,
        card_name: card.card_name || card.cards?.card_name,
        card_issuer: card.issuer || card.cards?.issuer,
        benefits: card.benefits || card.cards?.benefits,
        used_amount: card.used_amount,
      }));
      setCards(formattedCards);
    }
  }, [supabase]);

  const fetchAllCards = useCallback(async () => {
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
