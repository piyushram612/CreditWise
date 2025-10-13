import React, { useState, useEffect } from 'react';
import type { User, UserOwnedCard } from '@/app/types';
import { useCards } from '@/app/hooks/useCards';
// import { getDetailedCardInfo } from '@/app/utils/cardKnowledgeBase';
import { CreditCardIcon, BellIcon } from '@/app/components/shared/Icons';

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
      const cardNameLower = card.card_name?.toLowerCase() || '';
      // const issuerLower = card.issuer?.toLowerCase() || '';
      
      // HDFC Infinia - Premium Hacks
      if (cardNameLower.includes('infinia')) {
        generatedTips.push({
          id: `infinia-smartbuy-${card.id}`,
          category: 'points_transfer',
          title: '🎯 Infinia SmartBuy 10X Hack',
          description: 'Book flights through SmartBuy portal for 10X points instead of 3.3X direct booking',
          actionText: 'Always check SmartBuy before booking flights - can save ₹10,000+ on international tickets',
          cardName: card.card_name || '',
          value: '10X vs 3.3X points',
          urgency: 'high'
        });

        generatedTips.push({
          id: `infinia-transfer-${card.id}`,
          category: 'points_transfer',
          title: '✈️ Singapore Airlines Transfer Sweet Spot',
          description: 'Transfer Infinia points 1:1 to Singapore Airlines for premium cabin redemptions',
          actionText: 'Save 80,000 points for business class to Europe (worth ₹3+ lakhs)',
          cardName: card.card_name || '',
          value: '₹3,00,000+ value',
          urgency: 'medium'
        });
      }

      // Axis Magnus - Advanced Strategies
      if (cardNameLower.includes('magnus')) {
        generatedTips.push({
          id: `magnus-milestone-${card.id}`,
          category: 'milestone',
          title: '🎯 Magnus ₹1L Monthly Milestone Hack',
          description: 'Hit ₹1 lakh monthly spend for 25,000 bonus points (25% extra rewards)',
          actionText: 'Time rent, insurance, and large purchases to hit milestone consistently',
          cardName: card.card_name || '',
          value: '25% bonus rewards',
          urgency: 'high'
        });

        generatedTips.push({
          id: `magnus-transfer-${card.id}`,
          category: 'points_transfer',
          title: '🏆 25K Points = 5K Miles Sweet Spot',
          description: 'Transfer exactly 25,000 Edge Rewards for 5,000 airline miles (best ratio)',
          actionText: 'Never transfer less than 25K - wait to accumulate for optimal value',
          cardName: card.card_name || '',
          value: '5:1 transfer ratio',
          urgency: 'medium'
        });
      }

      // SBI Cashback - Unlimited Hack
      if (cardNameLower.includes('sbi') && cardNameLower.includes('cashback')) {
        generatedTips.push({
          id: `sbi-wallet-${card.id}`,
          category: 'cashback',
          title: '💰 Unlimited 5% Offline Hack',
          description: 'Load wallets online (5% cashback) then use offline for effective 5% everywhere',
          actionText: 'Load Paytm/PhonePe online monthly, use for offline merchants',
          cardName: card.card_name || '',
          value: '5% unlimited offline',
          urgency: 'high'
        });

        generatedTips.push({
          id: `sbi-bill-${card.id}`,
          category: 'cashback',
          title: '🔥 Bill Payment 5% Hack',
          description: 'Pay rent, insurance, utilities online for 5% cashback (no limits)',
          actionText: 'Set up all recurring payments online - save ₹1000s monthly',
          cardName: card.card_name || '',
          value: '5% on all bills',
          urgency: 'high'
        });
      }

      // IDFC First Power+ HP
      if (cardNameLower.includes('idfc') && cardNameLower.includes('hp')) {
        generatedTips.push({
          id: `idfc-hp-${card.id}`,
          category: 'partnership',
          title: '⛽ HP Pay 10X Points Hack',
          description: 'Use HP Pay app for 10X points (5% return) vs 2X for direct card swipe',
          actionText: 'Always load HP Pay wallet first, then fuel - never swipe directly',
          cardName: card.card_name || '',
          value: '5X more rewards',
          urgency: 'high'
        });
      }

      // Amazon Pay ICICI
      if (cardNameLower.includes('amazon')) {
        generatedTips.push({
          id: `amazon-prime-${card.id}`,
          category: 'cashback',
          title: '📦 Amazon Prime Day Strategy',
          description: 'Combine 5% cashback with Prime Day deals for 15-20% total savings',
          actionText: 'Stock up on annual needs during Prime sales with this card',
          cardName: card.card_name || '',
          value: '15-20% total savings',
          urgency: 'medium'
        });
      }

      // Tata Neu Cards
      if (cardNameLower.includes('tata neu')) {
        generatedTips.push({
          id: `tata-neu-${card.id}`,
          category: 'partnership',
          title: '🛒 Tata Ecosystem Multiplier',
          description: 'Use across Tata brands (BigBasket, Croma, Westside) for 5% NeuCoins',
          actionText: 'Plan monthly shopping across Tata ecosystem for maximum NeuCoins',
          cardName: card.card_name || '',
          value: '5% across ecosystem',
          urgency: 'medium'
        });
      }

      // Credit Utilization Optimization
      const utilization = card.credit_limit && card.used_amount ? 
        (card.used_amount / card.credit_limit) * 100 : 0;
      
      if (utilization > 30) {
        generatedTips.push({
          id: `utilization-${card.id}`,
          category: 'milestone',
          title: '📊 Credit Score Optimization',
          description: `Your utilization is ${Math.round(utilization)}% - reduce to <30% for 50+ point credit score boost`,
          actionText: 'Pay before statement generation or request limit increase',
          cardName: card.card_name || '',
          value: '+50 credit score points',
          urgency: 'high'
        });
      }

      // Low utilization opportunity
      if (utilization < 10 && card.credit_limit && card.credit_limit > 100000) {
        generatedTips.push({
          id: `underutilized-${card.id}`,
          category: 'milestone',
          title: '💎 Underutilized Premium Card',
          description: 'You have high limit but low usage - maximize rewards potential',
          actionText: 'Use for large purchases, rent payments, or business expenses',
          cardName: card.card_name || '',
          value: 'Untapped rewards potential',
          urgency: 'medium'
        });
      }
    });

    // Advanced Multi-Card Strategies
    if (cards.length >= 2) {
      generatedTips.push({
        id: 'multi-card-rotation',
        category: 'partnership',
        title: '🔄 Card Rotation Strategy',
        description: 'Rotate cards based on quarterly bonus categories and monthly milestones',
        actionText: 'Create spending calendar to maximize each card\'s peak earning periods',
        cardName: 'Portfolio Strategy',
        value: '3-5X more rewards',
        urgency: 'medium'
      });

      // Check for complementary cards
      const hasInfinia = cards.some(c => c.card_name?.toLowerCase().includes('infinia'));
      const hasMagnus = cards.some(c => c.card_name?.toLowerCase().includes('magnus'));
      const hasSBICashback = cards.some(c => c.card_name?.toLowerCase().includes('sbi') && c.card_name?.toLowerCase().includes('cashback'));

      if (hasInfinia && hasMagnus) {
        generatedTips.push({
          id: 'infinia-magnus-combo',
          category: 'points_transfer',
          title: '👑 Premium Card Combo Strategy',
          description: 'Use Magnus for milestones, Infinia for travel - transfer both to same airline',
          actionText: 'Accumulate points on both, transfer to Singapore Airlines for maximum value',
          cardName: 'Infinia + Magnus',
          value: 'Premium redemptions',
          urgency: 'high'
        });
      }

      if (hasSBICashback) {
        generatedTips.push({
          id: 'sbi-complement',
          category: 'cashback',
          title: '💡 SBI Cashback as Base Card',
          description: 'Use SBI Cashback for all online spends, other cards for their specialties',
          actionText: 'Make SBI your default online card, others for specific categories',
          cardName: 'SBI + Others',
          value: '5% baseline + bonuses',
          urgency: 'medium'
        });
      }
    }

    // Seasonal and Time-Sensitive Hacks
    const currentMonth = new Date().getMonth();
    // const currentDate = new Date();
    
    // Festive Season (Oct-Dec)
    if (currentMonth >= 9 && currentMonth <= 11) {
      generatedTips.push({
        id: 'festive-season',
        category: 'seasonal',
        title: '🎉 Festive Season Multiplier',
        description: 'Many cards offer 2-5X bonus during festive season on specific categories',
        actionText: 'Check for temporary bonus offers and plan major purchases accordingly',
        cardName: 'All Cards',
        value: 'Up to 5X bonus',
        urgency: 'high',
        expiryDate: '31st December'
      });
    }

    // Year-end strategies
    if (currentMonth === 11) {
      generatedTips.push({
        id: 'year-end-milestone',
        category: 'milestone',
        title: '📅 Year-End Milestone Rush',
        description: 'December is last chance to hit annual milestones for fee waivers',
        actionText: 'Calculate remaining spend needed and plan purchases strategically',
        cardName: 'All Cards',
        value: 'Fee waiver savings',
        urgency: 'high',
        expiryDate: '31st December'
      });
    }

    // Advanced Hacks for Power Users
    if (cards.length >= 3) {
      generatedTips.push({
        id: 'manufactured-spending',
        category: 'partnership',
        title: '🎯 Advanced Points Earning',
        description: 'Use gift cards, prepaid reloads, and bill payments to manufacture spending',
        actionText: 'Buy gift cards online (5% SBI), use for offline purchases, reload wallets strategically',
        cardName: 'Advanced Strategy',
        value: 'Unlimited earning potential',
        urgency: 'medium'
      });

      generatedTips.push({
        id: 'credit-cycling',
        category: 'milestone',
        title: '🔄 Credit Cycling for Milestones',
        description: 'Pay off balances mid-cycle to increase effective spending capacity',
        actionText: 'Pay before statement to reset available credit for milestone chasing',
        cardName: 'Portfolio Management',
        value: 'Double milestone potential',
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
    { id: 'all', name: 'All Hacks', icon: '🔥' },
    { id: 'points_transfer', name: 'Miles & Points', icon: '✈️' },
    { id: 'milestone', name: 'Milestones', icon: '🎯' },
    { id: 'cashback', name: 'Cashback Hacks', icon: '💰' },
    { id: 'partnership', name: 'Partnerships', icon: '🤝' },
    { id: 'seasonal', name: 'Limited Time', icon: '⏰' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  if (!user) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🔥 Credit Card Hacks & Strategies
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Advanced optimization techniques from credit card experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">🎯 Expert Milestone Strategies</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Hit Axis Magnus ₹1L monthly for 25% bonus rewards</li>
              <li>• Time large purchases around milestone deadlines</li>
              <li>• Use rent payments to reach spending thresholds</li>
              <li>• Pay insurance premiums strategically</li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-bold text-green-900 dark:text-green-100 mb-3">💰 Cashback Multiplication</h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li>• SBI Cashback: Load wallets online for 5% offline</li>
              <li>• Amazon Pay: 5% + Prime Day deals = 20% savings</li>
              <li>• Stack cashback with merchant offers</li>
              <li>• Use bill payments for guaranteed returns</li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3">✈️ Points Transfer Mastery</h3>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
              <li>• Transfer 25K Axis points = 5K airline miles</li>
              <li>• HDFC Infinia 1:1 to Singapore Airlines</li>
              <li>• Book business class for 80K points (₹3L value)</li>
              <li>• Never transfer less than optimal ratios</li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-3">🔄 Advanced Techniques</h3>
            <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
              <li>• Manufactured spending via gift cards</li>
              <li>• Credit cycling for milestone chasing</li>
              <li>• Multi-card rotation strategies</li>
              <li>• Seasonal bonus optimization</li>
            </ul>
          </div>
        </div>

        <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🚀 Get Personalized Hacks
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Log in to get specific optimization strategies for your credit cards
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            We&apos;ll analyze your portfolio and suggest expert-level hacks to maximize your rewards
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🔥 Credit Card Hacks & Strategies
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Advanced optimization techniques from credit card experts - maximize every rupee spent
        </p>
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          💡 Inspired by strategies from TheCreditCardGuy, DJSuvan, and other experts
        </div>
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