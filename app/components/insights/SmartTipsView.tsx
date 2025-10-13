import React, { useState, useEffect } from 'react';
import type { User, UserOwnedCard } from '@/app/types';
import { useCards } from '@/app/hooks/useCards';
// import { getDetailedCardInfo } from '@/app/utils/cardKnowledgeBase';
import { SparklesIcon, CreditCardIcon, BellIcon } from '@/app/components/shared/Icons';

interface SmartTip {
  id: string;
  category: 'points_transfer' | 'milestone' | 'cashback' | 'partnership' | 'seasonal';
  title: string;
  description: string;
  actionText: string;
  cardName: string;
  value: string;
  urgency: 'high' | 'medium' | 'low';
  expiryDate?: string;
}

interface SmartTipsViewProps {
  user: User | null;
}

export function SmartTipsView({ user }: SmartTipsViewProps) {
  const { userCards, isLoading } = useCards(user, 0);
  const [tips, setTips] = useState<SmartTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (userCards.length > 0) {
      generateSmartTips(userCards);
    }
  }, [userCards]);

  const generateSmartTips = (cards: UserOwnedCard[]) => {
    const generatedTips: SmartTip[] = [];

    cards.forEach(card => {
      // Get detailed card info for future enhancements
      // const detailedInfo = getDetailedCardInfo(card.card_name || '', card.issuer || '');
      
      // Points Transfer Tips
      if (card.card_name?.toLowerCase().includes('infinia')) {
        generatedTips.push({
          id: `infinia-transfer-${card.id}`,
          category: 'points_transfer',
          title: 'Premium Airline Miles Transfer',
          description: 'Transfer your HDFC Infinia points to airline partners at 1:1 ratio for premium redemptions',
          actionText: 'Gather 25,000 points and transfer to Singapore Airlines for business class flights',
          cardName: card.card_name || '',
          value: '₹1,25,000+ value',
          urgency: 'medium'
        });
      }

      if (card.card_name?.toLowerCase().includes('magnus')) {
        generatedTips.push({
          id: `magnus-transfer-${card.id}`,
          category: 'points_transfer',
          title: 'Axis Magnus Sweet Spot',
          description: 'Transfer 25,000 Edge Reward points to get 5,000 airline miles - best value transfer ratio',
          actionText: 'Accumulate 25,000 points for maximum transfer efficiency',
          cardName: card.card_name || '',
          value: '₹25,000+ value',
          urgency: 'high'
        });
      }

      if (card.card_name?.toLowerCase().includes('tata neu')) {
        generatedTips.push({
          id: `tata-bigbasket-${card.id}`,
          category: 'partnership',
          title: 'BigBasket 5% NeuCoins',
          description: 'Earn 5% NeuCoins on BigBasket purchases due to Tata&apos;s strategic partnership',
          actionText: 'Use for grocery shopping and convert NeuCoins to airline miles',
          cardName: card.card_name || '',
          value: '5% returns',
          urgency: 'medium'
        });
      }

      if (card.card_name?.toLowerCase().includes('amazon pay')) {
        generatedTips.push({
          id: `amazon-cashback-${card.id}`,
          category: 'cashback',
          title: 'Amazon 5% Cashback',
          description: 'Get 5% cashback on Amazon purchases with no upper limit',
          actionText: 'Use for all Amazon shopping including Prime membership',
          cardName: card.card_name || '',
          value: '5% unlimited',
          urgency: 'high'
        });
      }

      // Milestone Benefits
      if (card.card_name?.toLowerCase().includes('platinum travel')) {
        generatedTips.push({
          id: `amex-milestone-${card.id}`,
          category: 'milestone',
          title: 'Amex Platinum Travel Milestone',
          description: 'Spend ₹4 lakhs annually to get 40,000 bonus points',
          actionText: 'Plan your annual spends to hit this milestone for maximum rewards',
          cardName: card.card_name || '',
          value: '₹20,000+ bonus value',
          urgency: 'medium'
        });
      }

      // Utilization Tips
      const utilization = card.credit_limit && card.used_amount ? 
        (card.used_amount / card.credit_limit) * 100 : 0;
      
      if (utilization > 30) {
        generatedTips.push({
          id: `utilization-${card.id}`,
          category: 'milestone',
          title: 'Credit Utilization Alert',
          description: `Your ${card.card_name} utilization is ${Math.round(utilization)}% - keep it below 30% for better credit score`,
          actionText: 'Pay down balance or request credit limit increase',
          cardName: card.card_name || '',
          value: 'Credit Score Impact',
          urgency: 'high'
        });
      }

      // Seasonal Tips
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 9 && currentMonth <= 11) { // Oct-Dec
        generatedTips.push({
          id: `festive-${card.id}`,
          category: 'seasonal',
          title: 'Festive Season Bonus',
          description: 'Many cards offer bonus rewards during festive season',
          actionText: 'Check for temporary bonus categories and accelerated rewards',
          cardName: card.card_name || '',
          value: 'Up to 10x rewards',
          urgency: 'high',
          expiryDate: '31st December'
        });
      }
    });

    // Add general tips if user has multiple cards
    if (cards.length > 1) {
      generatedTips.push({
        id: 'multi-card-strategy',
        category: 'partnership',
        title: 'Multi-Card Strategy',
        description: 'Optimize spending across your cards based on category bonuses',
        actionText: 'Use different cards for groceries, fuel, online shopping for maximum rewards',
        cardName: 'All Cards',
        value: '2-5x more rewards',
        urgency: 'medium'
      });
    }

    setTips(generatedTips);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'points_transfer': return '✈️';
      case 'milestone': return '🎯';
      case 'cashback': return '💰';
      case 'partnership': return '🤝';
      case 'seasonal': return '🎉';
      default: return '💡';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'low': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const categories = [
    { id: 'all', name: 'All Tips', icon: '💡' },
    { id: 'points_transfer', name: 'Point Transfers', icon: '✈️' },
    { id: 'milestone', name: 'Milestones', icon: '🎯' },
    { id: 'cashback', name: 'Cashback', icon: '💰' },
    { id: 'partnership', name: 'Partnerships', icon: '🤝' },
    { id: 'seasonal', name: 'Seasonal', icon: '🎉' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <SparklesIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Smart Tips & Insights
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get personalized tips to maximize your credit card rewards
        </p>
        <p className="text-gray-400 dark:text-gray-500">
          Please log in to see personalized tips based on your cards
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Smart Tips & Insights
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Proactive suggestions to maximize your rewards and benefits
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Analyzing your cards for smart tips...
        </div>
      ) : userCards.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your credit cards to get personalized tips and insights
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            We&apos;ll analyze your cards and suggest the best ways to maximize rewards
          </p>
        </div>
      ) : filteredTips.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No tips available for the selected category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map(tip => (
            <div
              key={tip.id}
              className={`p-6 rounded-lg border-2 ${getUrgencyColor(tip.urgency)} transition-all hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tip.cardName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {tip.value}
                  </div>
                  {tip.urgency === 'high' && (
                    <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <BellIcon className="w-3 h-3" />
                      High Priority
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {tip.description}
              </p>

              <div className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  💡 Action: {tip.actionText}
                </p>
                {tip.expiryDate && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ⏰ Valid until: {tip.expiryDate}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {tips.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📊 Your Optimization Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Total Tips</div>
              <div className="text-blue-600 dark:text-blue-400">{tips.length}</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">High Priority</div>
              <div className="text-red-600 dark:text-red-400">
                {tips.filter(t => t.urgency === 'high').length}
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Point Transfers</div>
              <div className="text-blue-600 dark:text-blue-400">
                {tips.filter(t => t.category === 'points_transfer').length}
              </div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Active Cards</div>
              <div className="text-blue-600 dark:text-blue-400">{userCards.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}