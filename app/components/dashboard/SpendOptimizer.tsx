'use client';
import React, { useState } from 'react';
import type { Card } from '../../../lib/types';
import { SparklesIcon, CreditCardIcon } from '../icons';
import { createClient } from '@/lib/supabase/client';

const spendCategories = [
    "Dining & Food", "Travel", "Groceries", "Utilities", "Fuel", "Online Shopping", "Entertainment", "Other"
];

export default function SpendOptimizer({ cards }: { cards: Card[] }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [vendor, setVendor] = useState('');
    const [optimizationResult, setOptimizationResult] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);

    const supabase = createClient();

    const handleOptimize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) {
            alert("Please enter an amount and select a category.");
            return;
        }
        setIsOptimizing(true);
        setOptimizationResult('');

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
                },
                body: JSON.stringify({
                    cards,
                    spend: {
                        amount: parseFloat(amount),
                        category,
                        vendor,
                    },
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setOptimizationResult(data.recommendation);
            } else {
                throw new Error(data.error || 'Failed to get recommendation.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setOptimizationResult(`Error: ${errorMessage}`);
        } finally {
            setIsOptimizing(false);
        }
    };

    // Intelligent recommendation parser to display structured cards matching screenshot
    const getRecommendedCards = () => {
        if (!optimizationResult || cards.length === 0) return [];
        
        const matchedCards = cards.filter(card => {
            const name = card.card_name?.toLowerCase() || '';
            const issuer = card.issuer?.toLowerCase() || '';
            
            const words = name.split(' ');
            return words.some(w => w.length > 3 && optimizationResult.toLowerCase().includes(w)) ||
                   (issuer.length > 3 && optimizationResult.toLowerCase().includes(issuer));
        });

        // Fallback: if AI output doesn't match card names directly, use all cards
        const cardsToScore = matchedCards.length > 0 ? matchedCards : cards;

        return cardsToScore.map((card) => {
            let rewardRate = 1.5; 
            let description = "Standard base rewards on this transaction";
            
            const nameLower = card.card_name?.toLowerCase() || '';
            const cat = category.toLowerCase();
            
            if (nameLower.includes('cashback')) {
                if (cat.includes('online') || cat.includes('shopping')) {
                    rewardRate = 5.0;
                    description = "5% Direct Cash Cashback";
                } else {
                    rewardRate = 1.0;
                    description = "1% Default Offline Cashback";
                }
            } else if (nameLower.includes('infinia')) {
                if (cat.includes('travel') || cat.includes('flight')) {
                    rewardRate = 16.5; 
                    description = "10x Reward Points via HDFC SmartBuy";
                } else if (cat.includes('dining') || cat.includes('food')) {
                    rewardRate = 8.0;
                    description = "5x Reward Points on Dining";
                } else {
                    rewardRate = 3.3;
                    description = "3.3% default rewards return";
                }
            } else if (nameLower.includes('regalia')) {
                if (cat.includes('dining') || cat.includes('food')) {
                    rewardRate = 6.0;
                    description = "5x Reward Points on Dining";
                } else if (cat.includes('travel') || cat.includes('flight')) {
                    rewardRate = 12.0;
                    description = "10x Reward Points via HDFC SmartBuy";
                } else {
                    rewardRate = 1.3;
                    description = "1.3% standard rewards return";
                }
            } else if (nameLower.includes('magnus')) {
                if (cat.includes('travel')) {
                    rewardRate = 4.8;
                    description = "12x Points on premium travel partners";
                } else {
                    rewardRate = 1.2;
                    description = "1.2% base rewards rate on spends";
                }
            } else if (nameLower.includes('travel') || nameLower.includes('amex') || nameLower.includes('membership')) {
                if (cat.includes('travel') || cat.includes('hotel') || cat.includes('milestone')) {
                    rewardRate = 6.0;
                    description = "3x Membership Rewards on booking portals";
                } else {
                    rewardRate = 2.2;
                    description = "2x Membership Rewards points";
                }
            } else if (nameLower.includes('neu') || nameLower.includes('tata')) {
                if (cat.includes('grocery') || cat.includes('shopping')) {
                    rewardRate = 5.0;
                    description = "5% NeuCoins on partner Tata brands";
                } else {
                    rewardRate = 1.5;
                    description = "1.5% standard NeuCoins return";
                }
            } else if (nameLower.includes('hp') || nameLower.includes('fuel')) {
                if (cat.includes('fuel')) {
                    rewardRate = 5.0;
                    description = "10x points (5% return) using HP Pay app";
                } else {
                    rewardRate = 1.0;
                    description = "1% standard fuel point rewards";
                }
            }

            const amt = parseFloat(amount) || 0;
            const calculatedValue = Math.round(amt * (rewardRate / 100));

            return {
                card,
                rewardRate,
                description,
                netValue: calculatedValue || Math.round(rewardRate * 15)
            };
        }).sort((a, b) => b.netValue - a.netValue);
    };

    const recommendedList = getRecommendedCards();

    const getIssuerStyles = (issuer?: string | null) => {
        const iss = (issuer || '').toLowerCase();
        if (iss.includes('hdfc')) return { bg: 'bg-[#004B87]', text: 'HDFC' };
        if (iss.includes('sbi')) return { bg: 'bg-[#00a3e0]', text: 'SBI' };
        if (iss.includes('icici')) return { bg: 'bg-[#F58220]', text: 'ICICI' };
        if (iss.includes('axis')) return { bg: 'bg-[#981c4d]', text: 'AXIS' };
        if (iss.includes('amex') || iss.includes('american')) return { bg: 'bg-[#006fcf]', text: 'AMEX' };
        return { bg: 'bg-[#1E2538]', text: (issuer || 'CARD').slice(0, 4).toUpperCase() };
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* New Transaction Card */}
            <div className="bg-[#131622]/90 border border-[#1E2538] p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6 text-white border-b border-[#1E2538]/60 pb-4 select-none">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 7.5h.008v.008H10.5V7.5zm0 3h.008v.008H10.5v-.008zm0 3h.008v.008H10.5v-.008z" />
                    </svg>
                    <h2 className="text-lg font-bold text-white leading-none">New Transaction</h2>
                </div>

                <form onSubmit={handleOptimize} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="amount" className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Amount</label>
                            <input 
                                type="number" 
                                id="amount" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)} 
                                className="w-full bg-white text-black font-semibold text-base px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                                placeholder="₹ 0.00" 
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Category</label>
                            <select 
                                id="category" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="w-full bg-[#1E2538] border border-[#2A334B] text-white text-base px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                {spendCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="vendor" className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Vendor (Optional)</label>
                        <input 
                            type="text" 
                            id="vendor" 
                            value={vendor} 
                            onChange={(e) => setVendor(e.target.value)} 
                            className="w-full bg-white text-black font-semibold text-base px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                            placeholder="e.g. Swiggy, Amazon, MakeMyTrip" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isOptimizing || cards.length === 0} 
                        className="w-full flex justify-center items-center py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-500/20 disabled:bg-gray-700 disabled:opacity-50 select-none cursor-pointer"
                    >
                        {isOptimizing ? 'Optimizing...' : 'Find Best Card'}
                        <SparklesIcon className="ml-2 h-5 w-5" />
                    </button>
                </form>
            </div>

            {isOptimizing && (
                <div className="text-center text-gray-400 py-6 animate-pulse select-none font-medium">
                    Analyzing your cards...
                </div>
            )}

            {/* Recommendations Section */}
            {optimizationResult && (
                <div className="space-y-6">
                    {/* Top Recommendations */}
                    {recommendedList.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white tracking-tight select-none">Top Recommendations</h3>
                            <div className="space-y-3">
                                {recommendedList.map((rec, index) => {
                                    const style = getIssuerStyles(rec.card.issuer);
                                    const isBest = index === 0;
                                    return (
                                        <div 
                                            key={rec.card.id} 
                                            className={`bg-[#131622] border border-[#1E2538] rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:border-[#2A334B] ${
                                                isBest ? 'border-l-4 border-l-blue-500 shadow-md shadow-blue-900/5' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-8 rounded flex items-center justify-center text-[10px] font-extrabold text-white select-none ${style.bg}`}>
                                                    {style.text}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-white text-base leading-none">
                                                            {rec.card.card_name}
                                                        </h4>
                                                        {isBest && (
                                                            <span className="bg-blue-500/10 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-500/20 select-none uppercase tracking-wide">
                                                                Best Pick
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#82889A] mt-1 font-medium">
                                                        {rec.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${isBest ? 'text-blue-400' : 'text-white'}`}>
                                                    ~₹{rec.netValue}
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase mt-0.5">
                                                    Net Value
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Detailed Analysis */}
                    <div className="bg-[#131622]/90 border border-[#1E2538] p-6 rounded-2xl shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-[#1E2538]/60 pb-3 flex items-center gap-2 select-none">
                            <SparklesIcon className="w-5 h-5 text-blue-400" />
                            AI Expert Analysis
                        </h3>
                        <div className="prose prose-invert max-w-none text-sm text-[#B4B9C6] leading-relaxed" dangerouslySetInnerHTML={{ __html: optimizationResult.replace(/\n/g, '<br />') }} />
                    </div>
                </div>
            )}

            {cards.length === 0 && !isOptimizing && (
                <div className="text-center p-8 bg-[#131622]/40 border border-[#1E2538] rounded-2xl">
                    <CreditCardIcon className="mx-auto h-10 w-10 text-gray-500"/>
                    <p className="mt-4 text-white font-semibold">Please add a card to use the Spend Optimizer.</p>
                    <p className="text-xs text-gray-500 mt-1">You can add cards from the &apos;Your Wallet&apos; panel on the right.</p>
                </div>
            )}
        </div>
    );
}