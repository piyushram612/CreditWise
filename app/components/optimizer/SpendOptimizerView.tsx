import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { UserOwnedCard } from '@/app/types'

export default function SpendOptimizerView() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleOptimization = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        setError(null);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError("You must be logged in to use the optimizer.");
            setIsLoading(false);
            return;
        }
        const formData = new FormData(formRef.current!);
        const spendAmount = formData.get('amount');
        const spendCategory = formData.get('category');
        const vendor = formData.get('vendor'); // Get vendor from form
        try {
            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: spendAmount, category: spendCategory, vendor: vendor }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }
            const data = await response.json();
            setResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Spend Optimizer</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Find the best card for your next purchase.</p>
            <form ref={formRef} onSubmit={handleOptimization} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spend Amount (₹)</label>
                        <input name="amount" type="number" id="amount" placeholder="e.g., 2500" required onWheel={(e) => e.currentTarget.blur()} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spend Category</label>
                        <select name="category" id="category" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                            {mockSpendCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor (Optional)</label>
                        <input name="vendor" type="text" id="vendor" placeholder="e.g., Amazon, Swiggy" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" />
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Optimizing...</>
                        ) : (
                            <><SparklesIcon className="w-5 h-5" /><span className="ml-2">Find Best Card</span></>
                        )}
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {result && (
                <div className="mt-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recommendation</h3>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
                        <div className="flex items-center">
                           <div className="bg-green-500 p-2 rounded-full"><CreditCardIcon className="w-6 h-6 text-white"/></div>
                           <div className="ml-4">
                                <p className="text-sm text-green-700 dark:text-green-300">Best Option</p>
                                <p className="font-bold text-lg text-green-900 dark:text-green-100">{result.bestCard.name}</p>
                           </div>
                        </div>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{result.reason}</p>
                    </div>
                    {result.alternatives.length > 0 && (
                         <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Other Good Options:</h4>
                            <ul className="space-y-3">
                                {result.alternatives.map((alt: CardSuggestion, index: number) => (
                                    <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{alt.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alt.reason}</p>
                                    </li>
                                ))}
                            </ul>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}