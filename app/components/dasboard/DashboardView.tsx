import React, { useState, useEffect } from 'react';
import type { User } from '@/app/types';
import { getSupabaseClient } from '@/app/utils/supabase';
import { CreditCardIcon, SparklesIcon, ChatBubbleIcon, PlusIcon } from '@/app/components/shared/Icons';

interface DashboardViewProps {
  user: User | null;
  setActiveView: (view: string) => void;
  onAddCardClick: () => void;
}

export function DashboardView({ user, setActiveView, onAddCardClick }: DashboardViewProps) {
  const [stats, setStats] = useState({ cardCount: 0, totalLimit: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        setIsLoading(true);
        const supabase = getSupabaseClient();
        const { data, error, count } = await supabase
          .from('user_owned_cards')
          .select('credit_limit', { count: 'exact' })
          .eq('user_id', user.id);

        if (error) {
          console.error("Error fetching dashboard stats:", error);
        } else if (data) {
          const totalLimit = data.reduce((sum, card) => sum + (card.credit_limit || 0), 0);
          setStats({ cardCount: count ?? 0, totalLimit });
        }
        setIsLoading(false);
      };
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h2>

      {user && !isLoading && stats.cardCount === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
          <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Welcome to CreditWise!</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Get started by adding your first credit card to your wallet. This will unlock personalized
            recommendations from the Spend Optimizer and AI Advisor.
          </p>
          <button
            onClick={onAddCardClick}
            className="mt-4 flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            <span className="ml-2">Add Your First Card</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveView('my-cards')}
          className="text-left bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center text-green-500 mb-3">
            <CreditCardIcon />
            <h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">Your Wallet</h3>
          </div>
          {isLoading ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading stats...</p>
          ) : user ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You have <span className="font-bold text-green-600 dark:text-green-400">{stats.cardCount}</span> cards.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Total credit limit: <span className="font-bold text-green-600 dark:text-green-400">₹{stats.totalLimit.toLocaleString('en-IN')}</span>
              </p>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">Log in to see your wallet summary.</p>
          )}
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-blue-500 mb-3">
            <SparklesIcon />
            <h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">Spend Optimizer</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Find the best card for your next purchase.</p>
          <button
            onClick={() => setActiveView('optimizer')}
            className="w-full bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition p-2"
          >
            Optimize Now
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-purple-500 mb-3">
            <ChatBubbleIcon />
            <h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">AI Advisor</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Have a question? Ask our AI for help.</p>
          <button
            onClick={() => setActiveView('advisor')}
            className="w-full bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition p-2"
          >
            Ask Now
          </button>
        </div>
      </div>
    </div>
  );
}