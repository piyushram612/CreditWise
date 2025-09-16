import React, { useState } from 'react';
import type { User, UserOwnedCard } from '@/app/types';
import { TransactionConfirmModal } from './TransactionConfirmModal';
import { generateRandomTransaction, selectBestCardForTransaction } from '@/app/utils/transactionGenerator';
import { BellIcon } from '@/app/components/shared/Icons';

interface TransactionTestButtonProps {
  user: User;
  userCards: UserOwnedCard[];
  onTransactionProcessed: () => void;
}

export function TransactionTestButton({ user, userCards, onTransactionProcessed }: TransactionTestButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<{
    amount: number;
    merchantName: string;
    category: string;
    suggestedCard: UserOwnedCard;
  } | null>(null);

  const handleTestTransaction = () => {
    if (userCards.length === 0) return;

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
    setShowModal(true);
  };

  const handleTransactionConfirmed = () => {
    setCurrentTransaction(null);
    onTransactionProcessed();
  };

  // Debug: Always show button with card count
  return (
    <>
      <button
        onClick={handleTestTransaction}
        className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        title={`Test Transaction (${userCards.length} cards)`}
        style={{ zIndex: 9999 }}
      >
        <BellIcon className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {userCards.length}
        </span>
      </button>

      {currentTransaction && (
        <TransactionConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          user={user}
          card={currentTransaction.suggestedCard}
          transactionAmount={currentTransaction.amount}
          merchantName={currentTransaction.merchantName}
          onTransactionConfirmed={handleTransactionConfirmed}
        />
      )}
    </>
  );
}