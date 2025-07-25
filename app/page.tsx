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
const SunIcon = () => <Icon path="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />;
const MoonIcon = () => <Icon path="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />;
const TrashIcon = ({ className }: { className?: string }) => <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.718c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className={className} />;
const PencilSquareIcon = ({ className }: { className?: string }) => <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.781a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className={className} />;
const Bars3Icon = () => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />;
const Cog6ToothIcon = () => <Icon path="M10.343 3.94c.09-.542.56-1.008 1.11-1.227l.128-.052c.635-.248 1.334-.22 1.95.076l.052.026c.558.27 1.003.74 1.228 1.311l.052.128c.248.635.22 1.334-.076 1.95l-.026.052c-.27.558-.74 1.003-1.31 1.228l-.128.052c-.635.248-1.334.22-1.95-.076l-.052-.026c-.558-.27-1.003-.74-1.228-1.311l-.052-.128a2.25 2.25 0 01.076-1.95l.026-.052zM4.504 8.187c.09-.542.56-1.008 1.11-1.227l.128-.052c.635-.248 1.334-.22 1.95.076l.052.026c.558.27 1.003.74 1.228 1.311l.052.128c.248.635.22 1.334-.076 1.95l-.026.052c-.27.558-.74 1.003-1.31 1.228l-.128.052c-.635.248-1.334.22-1.95-.076l-.052-.026c-.558-.27-1.003-.74-1.228-1.311l-.052-.128a2.25 2.25 0 01.076-1.95l.026-.052zM16.157 8.187a2.25 2.25 0 011.31 1.228l.052.128c.248.635.22 1.334-.076 1.95l-.026.052c-.27.558-.74 1.003-1.31 1.228l-.128.052c-.635.248-1.334.22-1.95-.076l-.052-.026c-.558-.27-1.003-.74-1.228-1.311l-.052-.128c-.248-.635-.22-1.334.076-1.95l.026-.052c.558-.27 1.003-.74 1.228-1.311l.128-.052c.635-.248 1.334-.22 1.95.076l.052.026zM10.343 15.94c.09.542.56 1.008 1.11 1.227l.128.052c.635.248 1.334.22 1.95-.076l.052-.026c.558-.27 1.003-.74 1.228-1.311l.052-.128c.248-.635.22-1.334-.076-1.95l-.026-.052c-.27-.558-.74 1.003-1.31-1.228l-.128.052c-.635-.248-1.334-.22-1.95.076l-.052.026c-.558-.27-1.003-.74-1.228-1.311l-.052-.128a2.25 2.25 0 01.076-1.95l.026.052z" />;


// --- Data Structures and Types ---
interface RewardValue {
    rate: number;
    type: string;
    notes: string;
}
interface LoungeAccess {
    domestic?: string;
    international?: string;
}
interface Card {
    id: string;
    card_name: string;
    issuer: string;
    network?: string;
    annual_fee?: number;
    reward_rates?: Record<string, RewardValue>;
    benefits?: string;
    card_type?: string[];
    joining_fee?: number;
    fee_waiver?: string;
    welcome_benefits?: string;
    milestone_benefits?: Record<string, unknown>[];
    lounge_access?: LoungeAccess;
    other_benefits?: string[];
    suitability?: string;
}
interface UserOwnedCard {
    id: string;
    credit_limit?: number;
    card_name: string;
    issuer: string;
    card_type?: string;
    benefits?: Record<string, string>;
    fees?: Record<string, string>;
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

// --- Modal Components ---
function CardFormModal({ isOpen, onClose, user, onCardSaved, existingCard }: { isOpen: boolean, onClose: () => void, user: User, onCardSaved: () => void, existingCard?: UserOwnedCard | null }) {
    const supabase = createClient();
    const [allCards, setAllCards] = useState<Card[]>([]);
    const [cardName, setCardName] = useState('');
    const [issuer, setIssuer] = useState('');
    const [cardType, setCardType] = useState('Points');
    const [creditLimit, setCreditLimit] = useState('');
    const [benefits, setBenefits] = useState([{ key: '', value: '' }]);
    const [fees, setFees] = useState([{ key: '', value: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllCards = async () => {
            const { data, error } = await supabase.from('cards').select('*').order('card_name', { ascending: true });
            if (!error) setAllCards(data || []);
        };
        fetchAllCards();
    }, [supabase]);

    useEffect(() => {
        if (isOpen && existingCard) {
            setCardName(existingCard.card_name || '');
            setIssuer(existingCard.issuer || '');
            setCardType(existingCard.card_type || 'Points');
            setCreditLimit(existingCard.credit_limit?.toString() || '');
            setBenefits(existingCard.benefits && Object.keys(existingCard.benefits).length > 0 ? Object.entries(existingCard.benefits).map(([key, value]) => ({ key, value: String(value) })) : [{ key: '', value: '' }]);
            setFees(existingCard.fees && Object.keys(existingCard.fees).length > 0 ? Object.entries(existingCard.fees).map(([key, value]) => ({ key, value: String(value) })) : [{ key: '', value: '' }]);
        } else if (isOpen) {
            setCardName('');
            setIssuer('');
            setCardType('Points');
            setCreditLimit('');
            setBenefits([{ key: '', value: '' }]);
            setFees([{ key: '', value: '' }]);
            setError(null);
        }
    }, [existingCard, isOpen]);


    const handleTemplateSelect = (cardId: string) => {
        const template = allCards.find(c => c.id === cardId);
        if (template) {
            setCardName(template.card_name);
            setIssuer(template.issuer);
            
            const newBenefits = [];
            if (template.reward_rates) {
                for (const [key, value] of Object.entries(template.reward_rates)) {
                    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const rate = value.rate ?? 'N/A';
                    const type = value.type ?? '';
                    const rateDisplay = `${rate}${typeof type === 'string' && type.includes('%') ? '%' : 'x'}`;
                    newBenefits.push({ key: formattedKey, value: `${rateDisplay} (${value.notes})` });
                }
            }
            if(template.welcome_benefits && template.welcome_benefits !== "None.") {
                newBenefits.push({ key: 'Welcome Benefit', value: template.welcome_benefits });
            }
            if(template.lounge_access?.domestic && template.lounge_access.domestic !== "None.") {
                newBenefits.push({ key: 'Domestic Lounge Access', value: template.lounge_access.domestic });
            }
            if(template.lounge_access?.international && template.lounge_access.international !== "None.") {
                newBenefits.push({ key: 'International Lounge Access', value: template.lounge_access.international });
            }

            setBenefits(newBenefits.length > 0 ? newBenefits : [{ key: '', value: '' }]);

            const newFees = [];
            if(template.joining_fee) {
                newFees.push({ key: 'Joining Fee', value: `₹${template.joining_fee}` });
            }
            if(template.annual_fee) {
                newFees.push({ key: 'Annual Fee', value: `₹${template.annual_fee}` });
            }
            if(template.fee_waiver && template.fee_waiver !== "None.") {
                newFees.push({ key: 'Fee Waiver', value: template.fee_waiver });
            }
            setFees(newFees.length > 0 ? newFees : [{ key: '', value: '' }]);
        }
    };
    
    const handleDynamicFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement>, fieldType: 'benefits' | 'fees') => {
        const list = fieldType === 'benefits' ? [...benefits] : [...fees];
        const updatedItem = { ...list[index], [event.target.name]: event.target.value };
        list[index] = updatedItem as { key: string; value: string; };

        if (fieldType === 'benefits') setBenefits(list);
        else setFees(list);
    };

    const addDynamicField = (fieldType: 'benefits' | 'fees') => {
        if (fieldType === 'benefits') setBenefits([...benefits, { key: '', value: '' }]);
        else setFees([...fees, { key: '', value: '' }]);
    };

    const removeDynamicField = (index: number, fieldType: 'benefits' | 'fees') => {
        const list = fieldType === 'benefits' ? [...benefits] : [...fees];
        list.splice(index, 1);
        if (fieldType === 'benefits') setBenefits(list);
        else setFees(list);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !issuer || !creditLimit) {
            setError("Card Name, Issuer, and Credit Limit are required.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const benefitsAsObject = benefits.reduce((obj, item) => item.key ? ({ ...obj, [item.key]: item.value }) : obj, {});
        const feesAsObject = fees.reduce((obj, item) => item.key ? ({ ...obj, [item.key]: item.value }) : obj, {});

        const cardData = {
            user_id: user.id,
            card_name: cardName,
            issuer: issuer,
            card_type: cardType,
            credit_limit: parseInt(creditLimit, 10),
            benefits: benefitsAsObject,
            fees: feesAsObject,
        };

        const { error: upsertError } = existingCard 
            ? await supabase.from('user_owned_cards').update(cardData).eq('id', existingCard.id)
            : await supabase.from('user_owned_cards').insert(cardData);

        setIsLoading(false);
        if (upsertError) {
            setError(upsertError.message);
        } else {
            onCardSaved();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 max-w-lg w-full relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon />
                </button>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">{existingCard ? 'Edit Credit Card' : 'Add a New Credit Card'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select a card from the list to autofill details, or enter them manually.</p>
                
                <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-2">
                    <select onChange={(e) => handleTemplateSelect(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-4">
                        <option value="">Or select a template to start...</option>
                        {allCards.map(card => (
                            <option key={card.id} value={card.id}>{card.card_name}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Name</label>
                            <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issuer</label>
                            <input type="text" value={issuer} onChange={e => setIssuer(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Type</label>
                            <select value={cardType} onChange={e => setCardType(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md">
                                <option>Points</option>
                                <option>Cashback</option>
                                <option>Miles</option>
                                <option>Travel</option>
                                <option>Lifestyle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credit Limit</label>
                            <input type="number" value={creditLimit} onChange={e => setCreditLimit(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-4">Benefits</h4>
                        {benefits.map((b, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                                <input name="key" placeholder="Benefit" value={b.key} onChange={e => handleDynamicFieldChange(index, e, 'benefits')} className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                                <input name="value" placeholder="Value" value={b.value} onChange={e => handleDynamicFieldChange(index, e, 'benefits')} className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                                <button type="button" onClick={() => removeDynamicField(index, 'benefits')} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicField('benefits')} className="mt-2 text-sm text-blue-500 font-semibold flex items-center gap-1"><PlusIcon className="w-4 h-4"/> Add Benefit</button>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-4">Fees</h4>
                        {fees.map((f, index) => (
                            <div key={index} className="flex items-center gap-2 mt-2">
                                <input name="key" placeholder="Fee Type" value={f.key} onChange={e => handleDynamicFieldChange(index, e, 'fees')} className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                                <input name="value" placeholder="Value" value={f.value} onChange={e => handleDynamicFieldChange(index, e, 'fees')} className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md" />
                                <button type="button" onClick={() => removeDynamicField(index, 'fees')} className="p-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addDynamicField('fees')} className="mt-2 text-sm text-blue-500 font-semibold flex items-center gap-1"><PlusIcon className="w-4 h-4"/> Add Fee</button>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full mt-6 flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300">
                        {isLoading ? 'Saving...' : 'Save Card'}
                    </button>
                </form>
            </div>
        </div>
    );
}
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, cardName }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, cardName: string }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to remove the <span className="font-semibold">{cardName}</span> from your wallet?</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition">Delete</button>
                </div>
            </div>
        </div>
    );
}
function AuthModal({ isOpen, onClose, supabase }: { isOpen: boolean, onClose: () => void, supabase: SupabaseClient }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XMarkIcon /></button>
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google', 'github']} theme="light" />
            </div>
        </div>
    );
}

// --- Main App Components ---

function Sidebar({ activeView, setActiveView, user, onAuthClick, supabase, theme, toggleTheme, onLinkClick }: { activeView: string, setActiveView: (view: string) => void, user: User | null, onAuthClick: () => void, supabase: SupabaseClient, theme: string, toggleTheme: () => void, onLinkClick: () => void }) {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon />, view: 'dashboard' },
        { name: 'My Cards', icon: <CreditCardIcon />, view: 'my-cards' },
        { name: 'Spend Optimizer', icon: <SparklesIcon />, view: 'optimizer' },
        { name: 'AI Card Advisor', icon: <ChatBubbleIcon />, view: 'advisor' },
        { name: 'Settings', icon: <Cog6ToothIcon />, view: 'settings' },
    ];
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        onLinkClick(); // Close sidebar on logout
    }

    return (
        <aside className="w-64 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 flex flex-col h-full">
            <div className="flex items-center mb-8 shrink-0">
                <SparklesIcon className="w-7 h-7 text-blue-500" />
                <h1 className="text-xl font-bold ml-2">CreditWise</h1>
            </div>
            <nav className="flex-grow overflow-y-auto">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name} className="mb-2">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.view); onLinkClick(); }}
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeView === item.view ? 'bg-blue-500 text-white shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {item.icon}
                                <span className="ml-4">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto shrink-0">
                 {user ? (
                    <div className="text-sm">
                        <p className="truncate px-3" title={user.email || 'User'}>{user.email}</p>
                        <button onClick={handleLogout} className="w-full text-left mt-2 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-semibold">Logout</button>
                    </div>
                ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); onAuthClick(); onLinkClick(); }} className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                        <UserCircleIcon />
                        <span className="ml-4">Login / Sign Up</span>
                    </a>
                )}
                <button onClick={toggleTheme} className="w-full flex items-center mt-4 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    <span className="ml-4">Toggle Theme</span>
                </button>
            </div>
        </aside>
    );
}

function MyCardsView({ user, onAddCardClick, onEditCard, onDeleteCard, key }: { user: User, onAddCardClick: () => void, onEditCard: (card: UserOwnedCard) => void, onDeleteCard: (card: UserOwnedCard) => void, key: number }) {
    const supabase = createClient();
    const [userCards, setUserCards] = useState<UserOwnedCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserCards = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from('user_owned_cards').select('*').eq('user_id', user.id);
            if (error) console.error("Error fetching user cards:", error);
            else setUserCards(data as UserOwnedCard[]);
            setIsLoading(false);
        };
        fetchUserCards();
    }, [user, supabase, key]);

    const getIssuerColor = (issuer: string) => {
        switch (issuer?.toLowerCase()) {
            case 'hdfc': return 'from-blue-500 to-indigo-600';
            case 'sbi': return 'from-cyan-500 to-blue-500';
            case 'icici': return 'from-orange-500 to-red-600';
            case 'axis': return 'from-purple-500 to-indigo-600';
            case 'amex': return 'from-blue-700 to-gray-900';
            case 'idfc': return 'from-red-500 to-purple-600';
            default: return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Cards</h2>
                <button onClick={onAddCardClick} className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center">
                    <PlusIcon />
                    <span className="ml-2">Add New Card</span>
                </button>
            </div>
            {isLoading ? (
                <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading your cards...</div>
            ) : userCards.length === 0 ? (
                <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">You haven&apos;t added any cards yet.</p>
                    <button onClick={onAddCardClick} className="mt-4 text-blue-500 font-semibold">Add your first card</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userCards.map(ownedCard => (
                        <div key={ownedCard.id} className={`p-6 rounded-xl text-white shadow-lg flex flex-col justify-between bg-gradient-to-br ${getIssuerColor(ownedCard.issuer)} relative group min-h-[220px]`}>
                            <div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{ownedCard.issuer?.toUpperCase()}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEditCard(ownedCard)} className="p-1.5 bg-black/20 rounded-full hover:bg-black/40"><PencilSquareIcon className="w-4 h-4 text-white" /></button>
                                        <button onClick={() => onDeleteCard(ownedCard)} className="p-1.5 bg-black/20 rounded-full hover:bg-black/40"><TrashIcon className="w-4 h-4 text-white" /></button>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mt-4">{ownedCard.card_name}</h3>
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: spendAmount, category: spendCategory }),
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
                        <input name="amount" type="number" id="amount" placeholder="e.g., 2500" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Spend Category</label>
                        <select name="category" id="category" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                            {mockSpendCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
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

function AICardAdvisorView() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { from: 'ai', text: "Hi! How can I help you with your cards today? You can ask about rewards, benefits, or anything else." }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '' || isThinking) return;
        const userMessage: ChatMessage = { from: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            if (!response.ok) throw new Error("Failed to get a response from the advisor.");
            const data = await response.json();
            const aiMessage: ChatMessage = { from: 'ai', text: data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { from: 'ai', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">AI Card Advisor</h2>
            <div className="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col p-4">
                <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                            {msg.from === 'ai' && <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-xl p-3 rounded-lg ${msg.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0"><SparklesIcon className="w-5 h-5"/></div>
                            <div className="max-w-md p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-1"><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span><span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about rewards, fees, benefits..." className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" disabled={isThinking} />
                    <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300" disabled={isThinking}><SendIcon /></button>
                </form>
            </div>
        </div>
    );
}

function DashboardView({ user, setActiveView }: { user: User | null, setActiveView: (view: string) => void }) {
    const supabase = createClient();
    const [stats, setStats] = useState({ cardCount: 0, totalLimit: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                setIsLoading(true);
                const { data, error } = await supabase.from('user_owned_cards').select('credit_limit').eq('user_id', user.id);
                if (error) console.error("Error fetching dashboard stats:", error);
                else if (data) {
                    const cardCount = data.length;
                    const totalLimit = data.reduce((sum, card) => sum + (card.credit_limit || 0), 0);
                    setStats({ cardCount, totalLimit });
                }
                setIsLoading(false);
            };
            fetchStats();
        } else setIsLoading(false);
    }, [user, supabase]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-green-500 mb-3"><CreditCardIcon /><h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">Your Wallet</h3></div>
                    {isLoading ? <p className="text-gray-600 dark:text-gray-400 text-sm">Loading stats...</p> : user ? (
                        <><p className="text-gray-600 dark:text-gray-400 text-sm">You have <span className="font-bold text-green-600 dark:text-green-400">{stats.cardCount}</span> cards.</p><p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total credit limit: <span className="font-bold text-green-600 dark:text-green-400">₹{stats.totalLimit.toLocaleString('en-IN')}</span></p></>
                    ) : <p className="text-gray-600 dark:text-gray-400 text-sm">Log in to see your wallet summary.</p>}
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-blue-500 mb-3"><SparklesIcon /><h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">Spend Optimizer</h3></div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Find the best card for your next purchase.</p>
                    <button onClick={() => setActiveView('optimizer')} className="w-full bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition p-2">Optimize Now</button>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-purple-500 mb-3"><ChatBubbleIcon /><h3 className="font-bold text-lg ml-2 text-gray-800 dark:text-gray-100">AI Advisor</h3></div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Have a question? Ask our AI for help.</p>
                    <button onClick={() => setActiveView('advisor')} className="w-full bg-purple-500 text-white font-semibold rounded-md hover:bg-purple-600 transition p-2">Ask Now</button>
                </div>
            </div>
        </div>
    );
}

function SettingsView() {
    // State for the card request form
    const [cardRequestName, setCardRequestName] = useState('');
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');

    // State for the feedback form
    const [feedbackText, setFeedbackText] = useState('');
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleCardRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequestLoading(true);
        setRequestMessage('');

        try {
            const response = await fetch('/api/request-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardName: cardRequestName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong.');
            }

            setRequestMessage(data.message);
            setCardRequestName('');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
            // Display error message to the user
            setRequestMessage(`Error: ${message}`);
        } finally {
            setIsRequestLoading(false);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsFeedbackLoading(true);
        setFeedbackMessage('');
        
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedbackText: feedbackText }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong.');
            }

            setFeedbackMessage(data.message);
            setFeedbackText('');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
            // Display error message to the user
            setFeedbackMessage(`Error: ${message}`);
        } finally {
            setIsFeedbackLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings & Feedback</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card Request Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Request a New Card</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Is there a credit card you&apos;d like to see in our database? Let us know!</p>
                    <form onSubmit={handleCardRequestSubmit}>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Name</label>
                        <input id="cardName" name="cardName" type="text" value={cardRequestName} onChange={(e) => setCardRequestName(e.target.value)} required placeholder="e.g., HDFC Diners Club Black" className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" />
                        <button type="submit" disabled={isRequestLoading || !cardRequestName} className="mt-4 w-full flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isRequestLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                        {requestMessage && <p className="text-green-600 dark:text-green-400 text-sm mt-3 text-center">{requestMessage}</p>}
                    </form>
                </div>

                {/* Feedback Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Provide Feedback</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Have suggestions or found a bug? We&apos;d love to hear from you.</p>
                    <form onSubmit={handleFeedbackSubmit}>
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Feedback</label>
                        <textarea id="feedback" name="feedback" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} required rows={4} placeholder="Tell us what you think..." className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" />
                        <button type="submit" disabled={isFeedbackLoading || !feedbackText} className="mt-4 w-full flex justify-center items-center bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition-all duration-200 disabled:bg-purple-300 disabled:cursor-not-allowed">
                            {isFeedbackLoading ? 'Sending...' : 'Send Feedback'}
                        </button>
                        {feedbackMessage && <p className="text-green-600 dark:text-green-400 text-sm mt-3 text-center">{feedbackMessage}</p>}
                    </form>
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
    const [isCardFormModalOpen, setIsCardFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<UserOwnedCard | null>(null);
    const [cardToDelete, setCardToDelete] = useState<UserOwnedCard | null>(null);
    const [key, setKey] = useState(0);
    const [theme, setTheme] = useState('light');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    const supabase = createClient();

    useEffect(() => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAuthModalOpen(false);
        });
        return () => subscription?.unsubscribe();
    }, [supabase]);

    const handleCardSaved = () => setKey(prevKey => prevKey + 1);
    const handleCardDeleted = () => setKey(prevKey => prevKey + 1);
    const handleAddCardClick = () => {
        setCardToEdit(null);
        setIsCardFormModalOpen(true);
    };
    const handleEditCardClick = (card: UserOwnedCard) => {
        setCardToEdit(card);
        setIsCardFormModalOpen(true);
    };
    const handleDeleteCardClick = (card: UserOwnedCard) => {
        setCardToDelete(card);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = async () => {
        if (!cardToDelete) return;
        await supabase.from('user_owned_cards').delete().eq('id', cardToDelete.id);
        handleCardDeleted();
        setIsDeleteModalOpen(false);
        setCardToDelete(null);
    };

    const renderView = () => {
        if (!user && !['dashboard', 'settings'].includes(activeView)) {
             return <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Please log in to continue</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">This feature is available for registered users.</p>
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200">Login / Sign Up</button>
            </div>
        }
        switch (activeView) {
            case 'dashboard': return <DashboardView user={user} setActiveView={setActiveView} />;
            case 'my-cards': return user ? <MyCardsView key={key} user={user} onAddCardClick={handleAddCardClick} onEditCard={handleEditCardClick} onDeleteCard={handleDeleteCardClick} /> : null;
            case 'optimizer': return <SpendOptimizerView />;
            case 'advisor': return <AICardAdvisorView />;
            case 'settings': return <SettingsView />;
            default: return <DashboardView user={user} setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>}
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar 
                    activeView={activeView} setActiveView={setActiveView} user={user}
                    onAuthClick={() => setIsAuthModalOpen(true)}
                    supabase={supabase} theme={theme} toggleTheme={toggleTheme}
                    onLinkClick={() => setIsSidebarOpen(false)} // Close sidebar when a link is clicked
                />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 dark:text-gray-300"><Bars3Icon /></button>
                    <div className="flex items-center">
                        <SparklesIcon className="w-6 h-6 text-blue-500" />
                        <h1 className="text-lg font-bold ml-2">CreditWise</h1>
                    </div>
                    <div className="w-6"></div> {/* Spacer */}
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} supabase={supabase} />
            {user && (
                <>
                    <CardFormModal isOpen={isCardFormModalOpen} onClose={() => setIsCardFormModalOpen(false)} user={user} onCardSaved={handleCardSaved} existingCard={cardToEdit} />
                    <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} cardName={cardToDelete?.card_name || ''} />
                </>
            )}
        </div>
    );
}
