import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '../components/dashboard/Sidebar';
import CardList from '../components/dashboard/CardList';
import SpendOptimizer from '../components/dashboard/SpendOptimizer';
import AiCardAdvisor from '../components/dashboard/AiCardAdvisor';
import Settings from '../components/dashboard/Settings';
import type { Card } from '@/lib/types';

export default async function Dashboard() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: cards, error } = await supabase
    .from('user_owned_cards')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching cards:', error);
  }

  const typedCards: Card[] = cards || [];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SpendOptimizer cards={typedCards} />
            <AiCardAdvisor cards={typedCards} />
          </div>
          <div className="space-y-6">
            {/* Assuming CardList is a client component, it will fetch its own data or receive it as props */}
            {/* The initialCards prop is passed from the server */}
            <CardList initialCards={typedCards} />
            <Settings />
          </div>
        </div>
      </main>
    </div>
  );
}
