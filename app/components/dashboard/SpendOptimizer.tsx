'use client';
import React, { useState } from 'react';
import type { Card } from '../../../lib/types';
import { SparklesIcon, CreditCardIcon } from '../icons';

const spendCategories = [
    "Travel", "Dining", "Groceries", "Utilities", "Fuel", "Online Shopping", "Entertainment", "Other"
];

export default function SpendOptimizer({ cards }: { cards: Card[] }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [vendor, setVendor] = useState('');
    const [optimizationResult, setOptimizationResult] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);

    const handleOptimize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) {
            alert("Please enter an amount and select a category.");
            return;
        }
        setIsOptimizing(true);
        setOptimizationResult('');

        try {
            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Spend Optimizer</h1>
            <p className="text-gray-400 mb-6">Find the best card for your next purchase.</p>

            <form onSubmit={handleOptimize} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (₹)</label>
                        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., 5000" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select Category</option>
                            {spendCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="vendor" className="block text-sm font-medium text-gray-300 mb-1">Vendor (Optional)</label>
                    <input type="text" id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Amazon, Zomato" />
                </div>
                <button type="submit" disabled={isOptimizing || cards.length === 0} className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 transition-colors">
                    {isOptimizing ? 'Optimizing...' : 'Find Best Card'}
                    <SparklesIcon className="ml-2 h-5 w-5" />
                </button>
            </form>

            {isOptimizing && <div className="mt-6 text-center text-gray-400">Analyzing your cards...</div>}
            
            {optimizationResult && (
                <div className="mt-6 bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Recommendation:</h3>
                    <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: optimizationResult.replace(/\n/g, '<br />') }} />
                </div>
            )}

            {cards.length === 0 && !isOptimizing && (
                <div className="mt-6 text-center p-6 bg-gray-800 rounded-lg">
                    <CreditCardIcon className="mx-auto h-10 w-10 text-gray-500"/>
                    <p className="mt-4 text-white">Please add a card to use the Spend Optimizer.</p>
                    <p className="text-sm text-gray-400">You can add cards from the &apos;Your Cards&apos; panel on the right.</p>
                </div>
            )}
        </div>
    );
}
