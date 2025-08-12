import React from 'react';
import type { User, UserOwnedCard } from '@/app/types';
import { useCards } from '@/app/hooks/useCards';
import { getIssuerColorCode } from '@/app/utils/constants';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@/app/components/shared/Icons';

interface MyCardsViewProps {
  user: User;
  onAddCardClick: () => void;
  onEditCard: (card: UserOwnedCard) => void;
  onDeleteCard: (card: UserOwnedCard) => void;
  refreshKey: number;
}

export function MyCardsView({ user, onAddCardClick, onEditCard, onDeleteCard, refreshKey }: MyCardsViewProps) {
  const { userCards, isLoading } = useCards(user, refreshKey);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Cards</h2>
        <button 
          onClick={onAddCardClick} 
          className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center"
        >
          <PlusIcon />
          <span className="ml-2">Add New Card</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          Loading your cards...
        </div>
      ) : userCards.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">You haven&apos;t added any cards yet.</p>
          <button 
            onClick={onAddCardClick} 
            className="mt-4 text-blue-500 font-semibold"
          >
            Add your first card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {userCards.map(ownedCard => {
            const limit = ownedCard.credit_limit || 0;
            const used = ownedCard.used_amount || 0;
            const utilization = limit > 0 ? Math.round((used / limit) * 100) : 0;
            const utilizationWidth = Math.min(utilization, 100); // Cap at 100%

            return (
              <div 
                key={ownedCard.id} 
                className="rounded-xl shadow-lg flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative overflow-hidden border-t-20"
                style={{ borderTopColor: getIssuerColorCode(ownedCard.issuer) }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-100">
                        {ownedCard.card_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {ownedCard.issuer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEditCard(ownedCard)} 
                        className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <PencilSquareIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                      </button>
                      <button 
                        onClick={() => onDeleteCard(ownedCard)} 
                        className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Utilization Section */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Utilization</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${utilizationWidth}%` }}
                        ></div>
                      </div>
                      <p className="font-semibold text-blue-500">{utilization}%</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ₹{used.toLocaleString('en-IN')} used of ₹{limit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}