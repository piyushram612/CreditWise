"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { User, SupabaseClient } from '@supabase/supabase-js';

// --- Helper Components & Icons ---

interface IconProps {
  path: string;
  className?: string;
}

const Icon = ({ path, className = "w-6 h-6" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" className={className} />;
const DashboardIcon = () => <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />;
const SparklesIcon = ({ className }: { className?: string }) => <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.197-.398a2.25 2.25 0 001.423-1.423l.398-1.197.398 1.197a2.25 2.25 0 001.423 1.423l1.197.398-1.197.398a2.25 2.25 0 00-1.423 1.423z" className={className} />;
const ChatBubbleIcon = () => <Icon path="M8.625 12a.375.375 0 01.375.375v3.375c0 .207.168.375.375.375h3.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375h-7.5a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375.375h3.375a.375.375 0 01.375-.375v-3.375a.375.375 0 01-.375-.375h-3.375a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375-.375h7.5a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375h-3.375a.375.375 0 01-.375.375z" />;
const UserCircleIcon = () => <Icon path="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />;
const PlusIcon = ({ className }: { className?: string }) => <Icon path="M12 4.5v15m7.5-7.5h-15" className={className || "w-5 h-5"} />;
const SendIcon = () => <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />;
const XMarkIcon = () => <Icon path="M6 18L18 6M6 6l12 12" />;

// --- Data Structures and Types ---
interface Card {
    id: string;
    card_name: string;
    issuer: string;
    network?: string;
    annual_fee?: number;
    reward_rates?: any;
    benefits?: string;
}

interface UserOwnedCard {
    id: string;
    credit_limit?: number;
    cards: Card;
}

interface CardSuggestion {
  name: string;
  reason: string;
}

interface OptimizationResult {
  bestCard: {
    name: string;
    issuer: string;
  };
  reason: string;
  alternatives: CardSuggestion[];
}

interface ChatMessage {
    from: 'ai' | 'user';
    text: string;
}

// --- Mock Data ---
const mockSpendCategories: string[] = [
    'Dining & Restaurants', 'Online Shopping', 'Fuel', 'Utility Bills', 'Travel & Flights', 'Groceries', 'EMI Payments', 'Education Fees'
];

// --- New Components ---
function AddCardModal({ isOpen, onClose, user, onCardAdded }: { isOpen: boolean, onClose: () => void, user: User, onCardAdded: () => void }) {
    const supabase = createClient();
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [creditLimit, setCreditLimit] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchAllCards = async () => {
                const { data, error } = await supabase.from('cards').select('*');
                if (error) {
                    console.error('Error fetching cards:', error);
                } else {
                    setAllCards(data || []);
                }
            };
            fetchAllCards();
        }
    }, [isOpen, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCardId || !creditLimit) {
            setError("Please select a card and enter a credit limit.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const { error: insertError } = await supabase.from('user_owned_cards').insert({
            user_id: user.id,
            card_id: selectedCardId,
            credit_limit: parseInt(creditLimit, 10),
        });

        setIsLoading(false);
        if (insertError) {
            setError(insertError.message);
        } else {
            onCardAdded();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon />
                </button>
                <h3 className="text-2xl font-bold mb-4">Add a New Card</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">Credit Card</label>
                        <select
                            id="card"
                            value={selectedCardId}
                            onChange={(e) => setSelectedCardId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="" disabled>Select a card</option>
                            {allCards.map(card => (
                                <option key={card.id} value={card.id}>{card.card_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (₹)</label>
                        <input
                            type="number"
                            id="limit"
                            placeholder="e.g., 150000"
                            value={creditLimit}
                            onChange={(e) => setCreditLimit(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300">
                        {isLoading ? 'Adding...' : 'Add Card'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function AuthModal({ isOpen, onClose, supabase }: { isOpen: boolean, onClose: () => void, supabase: SupabaseClient }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon />
                </button>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    providers={['google', 'github']}
                    theme="light"
                />
            </div>
        </div>
    );
}

// --- Main App Components ---

function Sidebar({ activeView, setActiveView, user, onAuthClick, supabase }: { activeView: string, setActiveView: (view: string) => void, user: User | null, onAuthClick: () => void, supabase: SupabaseClient }) {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
        { name: 'My Cards', icon: <CreditCardIcon />, view: 'my-cards' },
        { name: 'Spend Optimizer', icon: <SparklesIcon />, view: 'optimizer' },
        { name: 'AI Card Advisor', icon: <ChatBubbleIcon />, view: 'advisor' },
    ];
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    }

    return (
        <aside className="w-64 bg-gray-50 text-gray-800 p-4 flex flex-col">
            <div className="flex items-center mb-8">
                <SparklesIcon />
                <h1 className="text-xl font-bold ml-2">CreditWise</h1>
            </div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name} className="mb-2">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.view); }}
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeView === item.view ? 'bg-blue-500 text-white shadow' : 'hover:bg-gray-200'}`}
                            >
                                {item.icon}
                                <span className="ml-4">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto">
                 {user ? (
                    <div className="text-sm">
                        <p className="truncate px-3" title={user.email || 'User'}>{user.email}</p>
                        <button onClick={handleLogout} className="w-full text-left mt-2 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold">
                           Logout
                        </button>
                    </div>
                ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); onAuthClick(); }} className="flex items-center p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                        <UserCircleIcon />
                        <span className="ml-4">Login / Sign Up</span>
                    </a>
                )}
            </div>
        </aside>
    );
}

function MyCardsView({ user, onAddCardClick, key }: { user: User, onAddCardClick: () => void, key: number }) {
    const supabase = createClient();
    const [userCards, setUserCards] = useState<UserOwnedCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserCards = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('user_owned_cards')
                .select('id, credit_limit, cards(*)')
                .eq('user_id', user.id);

            if (error) {
                console.error("Error fetching user cards:", error);
            } else {
                setUserCards(data as UserOwnedCard[]);
            }
            setIsLoading(false);
        };

        fetchUserCards();
    }, [user, supabase, key]);

    const getIssuerColor = (issuer: string) => {
        switch (issuer.toLowerCase()) {
            case 'hdfc': return 'from-blue-500 to-indigo-600';
            case 'sbi': return 'from-cyan-500 to-blue-500';
            case 'icici': return 'from-orange-500 to-red-600';
            default: return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">My Cards</h2>
                <button onClick={onAddCardClick} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 transform hover:scale-105">
                    <PlusIcon />
                    <span className="ml-2">Add New Card</span>
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-10">Loading your cards...</div>
            ) : userCards.length === 0 ? (
                <div className="text-center py-10 bg-gray-100 rounded-lg">
                    <p className="text-gray-600">You haven't added any cards yet.</p>
                    <button onClick={onAddCardClick} className="mt-4 text-blue-500 font-semibold">Add your first card</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userCards.map(ownedCard => (
                        <div key={ownedCard.id} className={`p-6 rounded-xl text-white shadow-lg flex flex-col justify-between bg-gradient-to-br ${getIssuerColor(ownedCard.cards.issuer)}`}>
                            <div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{ownedCard.cards.issuer.toUpperCase()}</span>
                                    <CreditCardIcon className="w-8 h-8 opacity-70" />
                                </div>
                                <h3 className="text-2xl font-bold mt-4">{ownedCard.cards.card_name}</h3>
                            </div>
                            <div className="mt-8">
                                <p className="text-sm opacity-80">Credit Limit</p>
                                <p className="font-mono text-lg tracking-wider">₹ {ownedCard.credit_limit?.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SpendOptimizerView() {
    const supabase = createClient();
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

        try {
            const response = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    amount: spendAmount,
                    category: spendCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            const data = await response.json();
            setResult(data);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Spend Optimizer</h2>
            <p className="text-gray-500 mb-6">Find the best card for your next purchase.</p>
            
            <form ref={formRef} onSubmit={handleOptimization} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Spend Amount (₹)</label>
                        <input name="amount" type="number" id="amount" placeholder="e.g., 2500" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Spend Category</label>
                        <select name="category" id="category" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                            {mockSpendCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
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
                <div className="mt-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendation</h3>
                    <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                        <div className="flex items-center">
                             <div className="bg-green-500 p-2 rounded-full">
                                <CreditCardIcon className="w-6 h-6 text-white"/>
                             </div>
                             <div className="ml-4">
                                <p className="text-sm text-green-700">Best Option</p>
                                <p className="font-bold text-lg text-green-900">{result.bestCard.name}</p>
                             </div>
                        </div>
                        <p className="mt-4 text-gray-700">{result.reason}</p>
                    </div>
                    {result.alternatives.length > 0 && (
                         <div className="mt-6">
                             <h4 className="font-semibold text-gray-700 mb-3">Other Good Options:</h4>
                             <ul className="space-y-3">
                                {result.alternatives.map((alt: CardSuggestion, index: number) => (
                                    <li key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                        <p className="font-bold text-gray-800">{alt.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{alt.reason}</p>
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

function AICardAdvisorView() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { from: 'ai', text: "Hi! How can I help you with your cards today? You can ask about rewards, benefits, or anything else." }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;
        
        const userMessage: ChatMessage = { from: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');

        setTimeout(() => {
            const aiMessage: ChatMessage = { from: 'ai', text: "That's a great question! Based on your HDFC Millennia card, you get 5 reward points for every ₹150 spent on dining. For your SBI SimplyCLICK, the reward rate is lower for offline dining." };
            setMessages(prev => [...prev, aiMessage]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Card Advisor</h2>
            <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col p-4">
                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                            {msg.from === 'ai' && <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about rewards, fees, benefits..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200">
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}

function DashboardView() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Card for Optimizer */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center text-blue-500 mb-3">
                        <SparklesIcon />
                        <h3 className="font-bold text-lg ml-2">Quick Optimize</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">Find the best card for a quick purchase.</p>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Amount" className="w-1/2 p-2 border rounded-md"/>
                        <button className="w-1/2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition">Find</button>
                    </div>
                </div>
                {/* Card for My Cards */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center text-green-500 mb-3">
                        <CreditCardIcon />
                        <h3 className="font-bold text-lg ml-2">Your Cards</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">You have 3 cards in your wallet.</p>
                    <div className="flex -space-x-2">
                         <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">H</div>
                         <div className="w-10 h-10 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-white font-bold">S</div>
                         <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white font-bold">I</div>
                    </div>
                </div>
                 {/* Card for AI Advisor */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center text-purple-500 mb-3">
                        <ChatBubbleIcon />
                        <h3 className="font-bold text-lg ml-2">AI Advisor</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">Have a question? Ask our AI for help.</p>
                    <button className="w-full bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition p-2">Ask Now</button>
                </div>
            </div>
        </div>
    );
}


// --- The Main App Component ---
export default function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [key, setKey] = useState(0); // Key to force re-render
    const supabase = createClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAuthModalOpen(false); // Close modal on successful login/signup
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase]);

    const handleCardAdded = () => {
        // Increment key to force MyCardsView to re-fetch data
        setKey(prevKey => prevKey + 1);
    };

    const renderView = () => {
        if (!user && activeView !== 'dashboard') {
             return <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Please log in to continue</h2>
                <p className="text-gray-500 mb-6">This feature is available for registered users.</p>
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200"
                >
                    Login / Sign Up
                </button>
            </div>
        }

        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'my-cards':
                return user ? <MyCardsView key={key} user={user} onAddCardClick={() => setIsAddCardModalOpen(true)} /> : null;
            case 'optimizer':
                return <SpendOptimizerView />;
            case 'advisor':
                return <AICardAdvisorView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                user={user}
                onAuthClick={() => setIsAuthModalOpen(true)}
                supabase={supabase}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)}
                supabase={supabase}
            />
            {user && (
                <AddCardModal
                    isOpen={isAddCardModalOpen}
                    onClose={() => setIsAddCardModalOpen(false)}
                    user={user}
                    onCardAdded={handleCardAdded}
                />
            )}
        </div>
    );
}
