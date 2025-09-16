import React, { useState, useEffect } from 'react';
import type { User, UserOwnedCard } from '@/app/types';
import { TransactionConfirmModal } from './TransactionConfirmModal';
import { generateRandomTransaction, selectBestCardForTransaction, getTransactionInsight } from '@/app/utils/transactionGenerator';
import { BellIcon, CreditCardIcon } from '@/app/components/shared/Icons';

interface TransactionPromptProps {
  user: User;
  userCards: UserOwnedCard[];
  onTransactionProcessed: () => void;
}

export function TransactionPrompt({ user, userCards, onTransactionProcessed }: TransactionPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<{
    amount: number;
    merchantName: string;
    category: string;
    suggestedCard: UserOwnedCard;
  } | null>(null);

  // Generate random transaction prompts
  useEffect(() => {
    if (userCards.length === 0) return;

    const generatePrompt = () => {
      const transaction = generateRandomTransaction(userCards);
      if (!transaction) return;

      const suggestedCard = selectBestCardForTransaction(
        userCards, 
        transaction.merchantName, 
        transaction.amount
      );

      if (!suggestedCard) return;

      setCurrentTransaction({
        ...transaction,
        suggestedCard
      });
      setShowPrompt(true);
    };

    // Generate first prompt after 10 seconds
    const initialTimer = setTimeout(generatePrompt, 10000);

    // Then generate prompts every 30-60 seconds
    const intervalTimer = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance each interval
        generatePrompt();
      }
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [userCards]);

  const handlePromptClick = () => {
    setShowPrompt(false);
    setShowModal(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setCurrentTransaction(null);
  };

  const handleTransactionConfirmed = () => {
    setCurrentTransaction(null);
    onTransactionProcessed();
  };

  if (!currentTransaction) return null;

  const insight = getTransactionInsight(
    currentTransaction.suggestedCard, 
    currentTransaction.merchantName, 
    currentTransaction.amount
  );

  return (
    <>
      {/* Floating notification prompt */}
      {showPrompt && (
        <div className="fixed top-4 right-4 z-40 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-slide-in-right">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BellIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Transaction Alert
                  </h4>
                  <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ₹{currentTransaction.amount.toLocaleString('en-IN')} at {currentTransaction.merchantName}
                </p>
                <div className="flex items-center gap-1 mb-3">
                  <CreditCardIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Suggested: {currentTransaction.suggestedCard.card_name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePromptClick}
                    className="flex-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Review
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1.5 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction confirmation modal */}
      <TransactionConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={user}
        card={currentTransaction.suggestedCard}
        transactionAmount={currentTransaction.amount}
        merchantName={currentTransaction.merchantName}
        onTransactionConfirmed={handleTransactionConfirmed}
      />

      {/* Add custom CSS for animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}