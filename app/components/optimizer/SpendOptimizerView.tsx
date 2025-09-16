import React, { useState, useRef } from 'react';
import { getSupabaseClient } from '@/app/utils/supabase';
import { apiCall } from '@/app/utils/api';
import { mockSpendCategories } from '@/app/utils/constants';
import type { OptimizationResult, User, UserOwnedCard } from '@/app/types';
import { SparklesIcon, BellIcon } from '@/app/components/shared/Icons';
import { OptimizationResult as OptimizationResultComponent } from './OptimizationResult';
import { TransactionConfirmModal } from '@/app/components/cards/TransactionConfirmModal';
import { selectBestCardForTransaction } from '@/app/utils/transactionGenerator';

interface SpendOptimizerViewProps {
  user?: User | null;
  onTransactionProcessed?: () => void;
}

export function SpendOptimizerView({ user, onTransactionProcessed }: SpendOptimizerViewProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userCards, setUserCards] = useState<UserOwnedCard[]>([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currentSpend, setCurrentSpend] = useState<{
    amount: number;
    category: string;
    vendor: string | null;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleOptimization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Unable to connect to database.");
      setIsLoading(false);
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setError("You must be logged in to use the optimizer.");
      setIsLoading(false);
      return;
    }

    // First, fetch user's cards
    const { data: userCards, error: cardsError } = await supabase
      .from('user_owned_cards')
      .select('*')
      .eq('user_id', session.user.id);

    if (cardsError) {
      setError("Failed to fetch your cards.");
      setIsLoading(false);
      return;
    }

    if (!userCards || userCards.length === 0) {
      setError("You need to add some cards first to use the optimizer.");
      setIsLoading(false);
      return;
    }

    // Store user cards for transaction simulation
    setUserCards(userCards);

    const formData = new FormData(formRef.current!);
    const spendAmount = formData.get('amount');
    const spendCategory = formData.get('category');
    const vendor = formData.get('vendor');

    const spendData = {
      amount: Number(spendAmount),
      category: spendCategory as string,
      vendor: vendor as string || null
    };

    // Store current spend data for transaction simulation
    setCurrentSpend(spendData);

    try {
      console.log('Making API call to optimize with data:', { 
        cards: userCards,
        spend: spendData
      });

      const response = await apiCall('/api/optimize', {
        method: 'POST',
        body: JSON.stringify({ 
          cards: userCards,
          spend: spendData
        }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse as JSON
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If not JSON, use the text as is
            errorMessage = errorText || errorMessage;
          }
        } catch {
          // If can't read response, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('Success response text:', responseText);
      
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
        
        // Check if there's an error in the response
        if (data.error) {
          console.error('API returned error:', data.error);
          if (data.details) {
            console.error('Error details:', data.details);
          }
          throw new Error(data.error + (data.details ? ` (${data.details})` : ''));
        }
        
        // The API returns { recommendation: "text" }, but we need to format it for display
        if (data.recommendation) {
          // Store the markdown recommendation directly
          setResult({
            bestCard: {
              name: "AI Recommendation",
              issuer: "Based on your cards"
            },
            reason: data.recommendation,
            alternatives: []
          });
        } else {
          console.error('No recommendation in response:', data);
          throw new Error('No recommendation received from server');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response text:', responseText);
        throw new Error('Invalid response format from server');
      }
    } catch (err: unknown) {
      console.error('Spend Optimizer Error:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        setError(err.message);
      } else {
        console.error('Unknown error:', err);
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Spend Optimizer</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Find the best card for your next purchase.</p>
      
      <form 
        ref={formRef} 
        onSubmit={handleOptimization} 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spend Amount (₹)
            </label>
            <input 
              name="amount" 
              type="number" 
              id="amount" 
              placeholder="e.g., 2500" 
              required 
              onWheel={(e) => e.currentTarget.blur()} 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spend Category
            </label>
            <select 
              name="category" 
              id="category" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {mockSpendCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vendor (Optional)
            </label>
            <input 
              name="vendor" 
              type="text" 
              id="vendor" 
              placeholder="e.g., Amazon, Swiggy" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Optimizing...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span className="ml-2">Find Best Card</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {result && (
        <div className="mt-6">
          <OptimizationResultComponent result={result} />
          
          {/* Transaction Simulation Button */}
          {user && currentSpend && userCards.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Test This Transaction
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Simulate making this ₹{currentSpend.amount.toLocaleString('en-IN')} purchase
                  </p>
                </div>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <BellIcon className="w-4 h-4" />
                  Simulate Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction Confirmation Modal */}
      {user && currentSpend && userCards.length > 0 && (
        <TransactionConfirmModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          user={user}
          card={selectBestCardForTransaction(
            userCards, 
            currentSpend.vendor || 'Generic Merchant', 
            currentSpend.amount
          ) || userCards[0]}
          transactionAmount={currentSpend.amount}
          merchantName={currentSpend.vendor || `${currentSpend.category} Purchase`}
          onTransactionConfirmed={() => {
            setShowTransactionModal(false);
            onTransactionProcessed?.();
          }}
        />
      )}
    </div>
  );
}