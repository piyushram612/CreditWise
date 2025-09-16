import React, { useState } from 'react';
import { getSupabaseClient } from '@/app/utils/supabase';
import type { User, UserOwnedCard } from '@/app/types';
import { XMarkIcon, CheckIcon } from '@/app/components/shared/Icons';

interface TransactionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  card: UserOwnedCard;
  transactionAmount: number;
  merchantName: string;
  onTransactionConfirmed: () => void;
}

export function TransactionConfirmModal({ 
  isOpen, 
  onClose, 
  user, 
  card, 
  transactionAmount, 
  merchantName,
  onTransactionConfirmed 
}: TransactionConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmTransaction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Unable to connect to database');
      }

      // Calculate new used amount
      const currentUsed = card.used_amount || 0;
      const newUsedAmount = currentUsed + transactionAmount;

      // Check if transaction would exceed credit limit
      const creditLimit = card.credit_limit || 0;
      if (newUsedAmount > creditLimit) {
        setError(`Transaction would exceed credit limit. Available credit: ₹${(creditLimit - currentUsed).toLocaleString('en-IN')}`);
        setIsLoading(false);
        return;
      }

      // Update the card's used amount
      const { error: updateError } = await supabase
        .from('user_owned_cards')
        .update({ used_amount: newUsedAmount })
        .eq('id', card.id);

      if (updateError) {
        throw updateError;
      }

      // Record the transaction (if transactions table exists)
      try {
        await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            card_id: card.id,
            amount: transactionAmount,
            merchant_name: merchantName,
            transaction_date: new Date().toISOString(),
            status: 'confirmed'
          });
      } catch {
        // If transactions table doesn't exist, we'll continue without recording
        console.log('Transactions table not available, continuing without recording transaction');
      }

      onTransactionConfirmed();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyTransaction = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentUsed = card.used_amount || 0;
  const creditLimit = card.credit_limit || 0;
  const availableCredit = creditLimit - currentUsed;
  const newUsedAmount = currentUsed + transactionAmount;
  const newUtilization = creditLimit > 0 ? Math.round((newUsedAmount / creditLimit) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <XMarkIcon />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Transaction Confirmation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Have you made this transaction?
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Card:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {card.card_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Merchant:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {merchantName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                ₹{transactionAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Used:</span>
              <span className="text-sm text-gray-900 dark:text-white">
                ₹{currentUsed.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">After Transaction:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ₹{newUsedAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">New Utilization:</span>
              <span className={`text-sm font-medium ${
                newUtilization > 80 ? 'text-red-600 dark:text-red-400' : 
                newUtilization > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-green-600 dark:text-green-400'
              }`}>
                {newUtilization}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Credit:</span>
              <span className="text-sm text-gray-900 dark:text-white">
                ₹{(availableCredit - transactionAmount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDenyTransaction}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-4 h-4 mr-2" />
            No, I didn&apos;t
          </button>
          <button
            onClick={handleConfirmTransaction}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Yes, confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}