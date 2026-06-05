'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr'; 
import type { Card, Json } from '../../../lib/types';
import type { Database } from '../../../lib/database.types';
import { PlusIcon, EditIcon, TrashIcon, CreditCardIcon, EyeIcon } from '../icons';

const CardDetailsModal = ({ card, onClose }: { card: Card; onClose: () => void; }) => {
    const renderJsonDetails = (details: Json | null | undefined) => {
        if (!details || typeof details !== 'object' || Array.isArray(details)) {
            return <li>No details available.</li>;
        }
        return Object.entries(details).map(([key, value]) => (
            <li key={key}>
                <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
            </li>
        ));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0E111A] border border-[#1E2538] p-6 rounded-2xl w-full max-w-md shadow-2xl text-white">
                <div className="flex justify-between items-center mb-4 select-none">
                    <h2 className="text-xl font-bold text-white">{card.card_name} Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="space-y-4 text-gray-300 max-h-96 overflow-y-auto pr-2">
                    <div>
                        <h3 className="font-bold text-lg text-indigo-400 mb-2">Benefits</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {renderJsonDetails(card.benefits)}
                        </ul>
                    </div>
                     {card.fees && (
                        <div>
                            <h3 className="font-bold text-lg text-indigo-400 mb-2">Fees</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {renderJsonDetails(card.fees)}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer">Close</button>
                </div>
            </div>
        </div>
    );
};

interface AddCardModalProps {
    allCards: Card[];
    onCardAdded: () => void;
    onClose: () => void;
    isDemo?: boolean;
    setCards?: React.Dispatch<React.SetStateAction<Card[]>>;
}

const AddCardModal = ({ allCards, onCardAdded, onClose, isDemo = false, setCards }: AddCardModalProps) => {
    const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
    const [creditLimit, setCreditLimit] = useState('');
    const [amountUsed, setAmountUsed] = useState('');
    const [selectedBank, setSelectedBank] = useState('All');

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const getBankCategory = (issuer: string) => {
        const iss = issuer.toLowerCase();
        if (iss.includes('hdfc')) return 'HDFC';
        if (iss.includes('sbi') || iss.includes('state bank')) return 'SBI';
        if (iss.includes('icici')) return 'ICICI';
        if (iss.includes('axis')) return 'AXIS';
        if (iss.includes('amex') || iss.includes('american')) return 'AMEX';
        return 'Others';
    };

    const filteredMasterCards = allCards.filter(c => {
        if (selectedBank === 'All') return true;
        return getBankCategory(c.issuer || '') === selectedBank;
    });

    const sortedFilteredMasterCards = [...filteredMasterCards].sort((a, b) => 
        (a.card_name || '').localeCompare(b.card_name || '')
    );

    const toggleCardSelection = (cardId: string) => {
        setSelectedCardIds(prev => 
            prev.includes(cardId) 
                ? prev.filter(id => id !== cardId) 
                : [...prev, cardId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCardIds.length === 0) {
            alert("Please select at least one card to add.");
            return;
        }
        if (!creditLimit) {
            alert("Total Limit is necessary. Used amount is fine even if not entered, but you must enter a Total Limit.");
            return;
        }
        
        const selectedMasterCards = allCards.filter(c => selectedCardIds.includes(c.id));

        if (isDemo) {
            const newCards: Card[] = selectedMasterCards.map((selectedMasterCard, index) => ({
                id: `demo-card-${Date.now()}-${index}`,
                user_id: 'demo-guest-user-id',
                card_id: selectedMasterCard.id,
                credit_limit: parseFloat(creditLimit),
                used_amount: parseFloat(amountUsed) || 0,
                card_name: selectedMasterCard.card_name || 'Demo Card',
                issuer: selectedMasterCard.issuer || 'Unknown',
                benefits: selectedMasterCard.benefits || null,
                fees: selectedMasterCard.fees || null,
                network: selectedMasterCard.network || null,
                annual_fee: selectedMasterCard.annual_fee || null,
                reward_rates: selectedMasterCard.reward_rates || null,
                card_type: selectedMasterCard.card_type || null,
                joining_fee: selectedMasterCard.joining_fee || null,
                fee_waiver: selectedMasterCard.fee_waiver || null,
                welcome_benefits: selectedMasterCard.welcome_benefits || null,
                milestone_benefits: selectedMasterCard.milestone_benefits || null,
                lounge_access: selectedMasterCard.lounge_access || null,
                other_benefits: selectedMasterCard.other_benefits || null,
                suitability: selectedMasterCard.suitability || null,
            }));

            if (setCards) {
                setCards(prev => [...prev, ...newCards]);
            }
            alert(`${selectedCardIds.length} card(s) added successfully (demo mode)!`);
            onClose();
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const insertData = selectedMasterCards.map(selectedMasterCard => ({
            user_id: user.id,
            card_id: selectedMasterCard.id,
            credit_limit: parseFloat(creditLimit),
            used_amount: parseFloat(amountUsed) || 0,
            card_name: selectedMasterCard.card_name,
            issuer: selectedMasterCard.issuer,
            benefits: selectedMasterCard.benefits,
            fees: selectedMasterCard.fees,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('user_owned_cards').insert(insertData);

        if (error) {
            alert('Error adding cards: ' + error.message);
        } else {
            alert(`${selectedCardIds.length} card(s) added successfully!`);
            onCardAdded();
            onClose();
        }
    };

    const selectedMasterCards = allCards.filter(c => selectedCardIds.includes(c.id));
    const cardNamePreview = selectedMasterCards.length === 1 
        ? (selectedMasterCards[0].card_name || 'Select Bank & Card')
        : selectedMasterCards.length > 1 
            ? `${selectedMasterCards.length} Cards Selected`
            : 'Select Bank & Card';
    const cardIssuerPreview = selectedMasterCards.length === 1 
        ? (selectedMasterCards[0].issuer || 'BANK')
        : selectedMasterCards.length > 1 
            ? 'MULTIPLE'
            : 'BANK';

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0E111A] border border-[#1E2538] p-5 rounded-2xl w-full max-w-md shadow-2xl relative text-white max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <div className="flex justify-between items-center mb-4 select-none">
                    <h2 className="text-lg font-bold text-white tracking-wide">Add Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-1 leading-none transition-colors">&times;</button>
                </div>
                
                {/* Visual Card Preview matching mockup */}
                <div className="bg-gradient-to-br from-[#1E2538] to-[#0A0D14] border border-[#2A334B] rounded-2xl p-4 h-36 flex flex-col justify-between shadow-inner relative overflow-hidden mb-4 select-none">
                    <div className="flex justify-between items-start z-10">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider bg-white/10 text-white border border-white/10 uppercase">
                            PREVIEW
                        </span>
                        {/* Wireless symbol */}
                        <svg className="w-5 h-5 text-gray-400 rotate-90" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 00-6-6M12 22.5c-5.799 0-10.5-4.701-10.5-10.5S6.201 1.5 12 1.5M12 15a2.25 2.25 0 00-2.25-2.25" />
                        </svg>
                    </div>
                    
                    {/* Metallic Chip illustration */}
                    <div className="w-9 h-7 rounded bg-amber-500/10 border border-amber-500/25 flex items-center justify-center z-10 shrink-0">
                        <div className="grid grid-cols-3 gap-0.5 w-6 h-4 opacity-50">
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 z-10">
                        <div className="space-y-1">
                            <p className="text-white font-extrabold text-sm leading-none tracking-wide truncate max-w-[200px]">{cardNamePreview}</p>
                            <p className="font-mono text-[10px] text-[#82889A] tracking-widest leading-none">•••• •••• •••• ••••</p>
                        </div>
                        <span className="text-xs font-black italic text-[#82889A] tracking-wider leading-none">
                            {cardIssuerPreview.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    {/* Background glow overlay */}
                    <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
                </div>

                {/* Selected Cards Badges List */}
                {selectedMasterCards.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 max-h-24 overflow-y-auto p-2 bg-[#131622] rounded-xl border border-[#1E2538] scrollbar-thin scrollbar-thumb-gray-800">
                        {selectedMasterCards.map(c => (
                            <span key={c.id} className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">
                                {c.card_name}
                                <button
                                    type="button"
                                    onClick={() => setSelectedCardIds(prev => prev.filter(id => id !== c.id))}
                                    className="text-blue-400 hover:text-white font-extrabold text-xs ml-1 cursor-pointer focus:outline-none"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Bank Pill Buttons Filter */}
                    <div>
                        <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-1.5 select-none">Filter By Bank</label>
                        <div className="flex flex-wrap gap-1.5 mb-1 select-none">
                            {['All', 'HDFC', 'SBI', 'ICICI', 'AXIS', 'AMEX', 'Others'].map(bank => (
                                <button
                                    key={bank}
                                    type="button"
                                    onClick={() => {
                                        setSelectedBank(bank);
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 border cursor-pointer ${
                                        selectedBank === bank
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.05)]'
                                            : 'bg-[#131622] border-[#1E2538] text-[#82889A] hover:text-white hover:bg-[#1E2538]'
                                    }`}
                                >
                                    {bank}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-1.5">Select Card(s)</label>
                        <div className="max-h-36 overflow-y-auto border border-[#1E2538] bg-[#131622] rounded-xl p-2 space-y-1 scrollbar-thin scrollbar-thumb-[#1E2538] scrollbar-track-transparent">
                            {sortedFilteredMasterCards.map((card) => {
                                const isSelected = selectedCardIds.includes(card.id);
                                return (
                                    <button
                                        key={card.id}
                                        type="button"
                                        onClick={() => toggleCardSelection(card.id)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer border ${
                                            isSelected 
                                                ? 'bg-blue-500/10 border-blue-500/30 text-white' 
                                                : 'bg-[#0E111A] border-[#1E2538] text-[#82889A] hover:bg-[#1E2538] hover:text-white'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm">{card.card_name}</span>
                                            <span className="text-[10px] text-gray-500 font-medium">{card.issuer}</span>
                                        </div>
                                        {isSelected && (
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                            {sortedFilteredMasterCards.length === 0 && (
                                <div className="text-center py-8 text-xs text-[#82889A]">
                                    No cards available for this bank.
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Total Limit *</label>
                            <input 
                                type="text" 
                                inputMode="decimal"
                                value={creditLimit} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                        setCreditLimit(val);
                                    }
                                }}
                                className="w-full bg-[#131622] border border-[#1E2538] text-white p-3 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-semibold transition-all duration-200" 
                                placeholder="₹ 0.00" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Used Amount (Optional)</label>
                            <input 
                                type="text" 
                                inputMode="decimal"
                                value={amountUsed} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                        setAmountUsed(val);
                                    }
                                }}
                                className="w-full bg-[#131622] border border-[#1E2538] text-white p-3 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-semibold transition-all duration-200" 
                                placeholder="₹ 0.00"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-3 border-t border-[#1E2538] select-none">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 rounded-xl border border-[#1E2538] hover:bg-gray-800/40 text-gray-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Add Card(s)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface EditCardModalProps {
    card: Card;
    onCardUpdated: () => void;
    onClose: () => void;
    isDemo?: boolean;
    setCards?: React.Dispatch<React.SetStateAction<Card[]>>;
}

const EditCardModal = ({ card, onCardUpdated, onClose, isDemo = false, setCards }: EditCardModalProps) => {
    const [creditLimit, setCreditLimit] = useState(card.credit_limit?.toString() ?? '');
    const [amountUsed, setAmountUsed] = useState(card.used_amount?.toString() ?? '');
    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isDemo) {
            if (setCards) {
                setCards(prev => prev.map(c => c.id === card.id ? {
                    ...c,
                    credit_limit: parseFloat(creditLimit) || 0,
                    used_amount: parseFloat(amountUsed) || 0,
                } : c));
            }
            alert('Card updated (demo mode)!');
            onClose();
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('user_owned_cards').update({
            credit_limit: parseFloat(creditLimit),
            used_amount: parseFloat(amountUsed),
        }).eq('id', card.id);

        if (error) {
            alert('Error updating card: ' + error.message);
        } else {
            alert('Card updated!');
            onCardUpdated();
            onClose();
        }
    };

    const cardNamePreview = card.card_name || 'Credit Card';
    const cardIssuerPreview = card.issuer || 'BANK';

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0E111A] border border-[#1E2538] p-5 rounded-2xl w-full max-w-md shadow-2xl relative text-white max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <div className="flex justify-between items-center mb-4 select-none">
                    <h2 className="text-lg font-bold text-white tracking-wide">Edit {cardNamePreview}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-1 leading-none transition-colors">&times;</button>
                </div>
                
                {/* Visual Card Preview matching mockup */}
                <div className="bg-gradient-to-br from-[#1E2538] to-[#0A0D14] border border-[#2A334B] rounded-2xl p-4 h-36 flex flex-col justify-between shadow-inner relative overflow-hidden mb-4 select-none">
                    <div className="flex justify-between items-start z-10">
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wider bg-white/10 text-white border border-white/10 uppercase">
                            PREVIEW
                        </span>
                        {/* Wireless symbol */}
                        <svg className="w-5 h-5 text-gray-400 rotate-90" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 00-6-6M12 22.5c-5.799 0-10.5-4.701-10.5-10.5S6.201 1.5 12 1.5M12 15a2.25 2.25 0 00-2.25-2.25" />
                        </svg>
                    </div>
                    
                    {/* Metallic Chip illustration */}
                    <div className="w-9 h-7 rounded bg-amber-500/10 border border-amber-500/25 flex items-center justify-center z-10 shrink-0">
                        <div className="grid grid-cols-3 gap-0.5 w-6 h-4 opacity-50">
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                            <div className="border border-amber-500/40 rounded-sm"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 z-10">
                        <div className="space-y-1">
                            <p className="text-white font-extrabold text-sm leading-none tracking-wide truncate max-w-[200px]">{cardNamePreview}</p>
                            <p className="font-mono text-[10px] text-[#82889A] tracking-widest leading-none">•••• •••• •••• ••••</p>
                        </div>
                        <span className="text-xs font-black italic text-[#82889A] tracking-wider leading-none">
                            {cardIssuerPreview.slice(0, 8).toUpperCase()}
                        </span>
                    </div>
                    {/* Background glow overlay */}
                    <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Total Limit</label>
                            <input 
                                type="text" 
                                inputMode="decimal"
                                value={creditLimit} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                        setCreditLimit(val);
                                    }
                                }}
                                className="w-full bg-[#131622] border border-[#1E2538] text-white p-3 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-[#1E2538] text-sm font-semibold transition-all duration-200" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#82889A] tracking-wider uppercase mb-2">Used Amount</label>
                            <input 
                                type="text" 
                                inputMode="decimal"
                                value={amountUsed} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                        setAmountUsed(val);
                                    }
                                }}
                                className="w-full bg-[#131622] border border-[#1E2538] text-white p-3 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-[#1E2538] text-sm font-semibold transition-all duration-200" 
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-3 border-t border-[#1E2538] select-none">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 rounded-xl border border-[#1E2538] hover:bg-gray-800/40 text-gray-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Update Card
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface CardListProps {
    cards: Card[];
    onCardUpdate: () => void;
    allCards: Card[];
    isDemo?: boolean;
    setCards?: React.Dispatch<React.SetStateAction<Card[]>>;
    onCollapseToggle?: () => void;
}

const DemoRestrictionModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-[#0E111A] border border-[#1E2538] p-6 rounded-2xl w-full max-w-sm shadow-2xl relative text-white text-center">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Create an Account to Add Cards</h3>
                <p className="text-xs text-[#82889A] mb-6 leading-relaxed">
                    To add cards, you need to sign in and create an account. The demo mode is just to understand how the app works!
                </p>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => {
                            onClose();
                            window.location.href = '/';
                        }} 
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/10 transition-all cursor-pointer"
                    >
                        Sign In / Create Account
                    </button>
                    <button 
                        onClick={onClose} 
                        className="w-full py-2.5 rounded-xl border border-[#1E2538] hover:bg-gray-800/40 text-gray-400 hover:text-white text-sm font-semibold transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CardList({ cards, onCardUpdate, allCards, isDemo = false, setCards, onCollapseToggle }: CardListProps) {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showDemoRestriction, setShowDemoRestriction] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [viewingCard, setViewingCard] = useState<Card | null>(null);
    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleDelete = async (cardId: string) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        
        if (isDemo) {
            if (setCards) {
                setCards(prev => prev.filter(c => c.id !== cardId));
            }
            alert('Card deleted (demo mode).');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).from('user_owned_cards').delete().eq('id', cardId);
        if (error) {
            alert('Error deleting card: ' + error.message);
        } else {
            alert('Card deleted.');
            onCardUpdate();
        }
    };

    const getIssuerStyles = (issuer?: string | null) => {
        const iss = (issuer || '').toLowerCase();
        if (iss.includes('hdfc')) return { bg: 'bg-[#004B87]/15 text-[#004B87] dark:text-[#3B9CFF] dark:bg-[#3B9CFF]/10 border border-[#3B9CFF]/20', text: 'HDFC', gradient: 'from-blue-500 to-indigo-500' };
        if (iss.includes('sbi')) return { bg: 'bg-[#00a3e0]/15 text-[#00a3e0] dark:text-[#38BDF8] dark:bg-[#38BDF8]/10 border border-[#38BDF8]/20', text: 'SBI', gradient: 'from-[#00a3e0] to-cyan-400' };
        if (iss.includes('icici')) return { bg: 'bg-[#F58220]/15 text-[#F58220] dark:text-[#FB923C] dark:bg-[#FB923C]/10 border border-[#FB923C]/20', text: 'ICICI', gradient: 'from-[#F58220] to-[#FF9E4A]' };
        if (iss.includes('axis')) return { bg: 'bg-[#981c4d]/15 text-[#981c4d] dark:text-[#FDA4AF] dark:bg-[#FDA4AF]/10 border border-[#FDA4AF]/20', text: 'AXIS', gradient: 'from-[#981c4d] to-[#C23C73]' };
        if (iss.includes('amex') || iss.includes('american')) return { bg: 'bg-[#006fcf]/15 text-[#006fcf] dark:text-[#2DD4BF] dark:bg-[#2DD4BF]/10 border border-[#2DD4BF]/20', text: 'AMEX', gradient: 'from-teal-400 to-emerald-500' };
        return { bg: 'bg-[#1E2538] text-[#82889A] border border-gray-700/20', text: (issuer || 'CARD').slice(0, 4).toUpperCase(), gradient: 'from-blue-600 to-indigo-600' };
    };

    const getMaskedNumber = () => {
        return '•••• •••• •••• ••••';
    };

    return (
        <div className="bg-[#0E111A] border border-[#1E2538] rounded-2xl p-6 h-full flex flex-col overflow-hidden">
            {showAddCardModal && <AddCardModal allCards={allCards} onCardAdded={onCardUpdate} onClose={() => setShowAddCardModal(false)} isDemo={isDemo} setCards={setCards} />}
            {showDemoRestriction && <DemoRestrictionModal onClose={() => setShowDemoRestriction(false)} />}
            {editingCard && <EditCardModal card={editingCard} onCardUpdated={onCardUpdate} onClose={() => setEditingCard(null)} isDemo={isDemo} setCards={setCards} />}
            {viewingCard && <CardDetailsModal card={viewingCard} onClose={() => setViewingCard(null)} />}

            {/* Header with Ellipsis Menu and Collapse Button */}
            <div className="flex justify-between items-center mb-6 shrink-0 select-none">
                <h2 className="text-lg font-bold text-white tracking-wide">Your Wallet</h2>
                <div className="flex items-center gap-1">
                    {onCollapseToggle && (
                        <button 
                            onClick={onCollapseToggle} 
                            className="text-[#82889A] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/40"
                            title="Collapse Wallet"
                        >
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M4.5 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}
                    <button className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800/40">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scrollable Card List Container */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                {cards.length > 0 ? [...cards].sort((a, b) => (a.card_name || '').localeCompare(b.card_name || '')).map(card => {
                    const styleInfo = getIssuerStyles(card.issuer);
                    const usagePercentage = Math.min(100, Math.max(0, ((card.used_amount ?? 0) / (card.credit_limit ?? 1)) * 100));
                    
                    return (
                        <div key={card.id} className="bg-[#131622]/90 border border-[#1E2538] p-5 rounded-2xl hover:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider ${styleInfo.bg}`}>
                                            {styleInfo.text}
                                        </span>
                                        <div className="flex items-center">
                                            <p className="font-bold text-white text-base leading-snug">{card.card_name}</p>
                                            <svg className="w-4 h-4 text-blue-500 fill-blue-500/20 inline-block align-middle ml-1.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs font-mono text-[#82889A] tracking-wider">
                                        {getMaskedNumber()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-0.5 shrink-0 bg-[#0E111A]/80 border border-[#1E2538] rounded-xl p-1">
                                    <button onClick={() => setViewingCard(card)} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg" title="View details"><EyeIcon className="h-4 w-4" /></button>
                                    <button onClick={() => setEditingCard(card)} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg" title="Edit limit"><EditIcon className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(card.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-lg" title="Delete card"><TrashIcon className="h-4 w-4" /></button>
                                </div>
                            </div>
                            
                            <div className="mt-5 space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-[#82889A]">Used: <span className="text-white">₹{(card.used_amount ?? 0).toLocaleString('en-IN')}</span></span>
                                    <span className="text-[#82889A]">Limit: <span className="text-white">₹{(card.credit_limit ?? 0).toLocaleString('en-IN')}</span></span>
                                </div>
                                <div className="w-full bg-[#1E2538] rounded-full h-2">
                                    <div className={`bg-gradient-to-r ${styleInfo.gradient} h-2 rounded-full transition-all duration-500`} style={{ width: `${usagePercentage}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                     <div className="text-center py-16 px-4 border border-dashed border-[#1E2538] rounded-2xl bg-[#131622]/40 select-none">
                         <CreditCardIcon className="mx-auto h-10 w-10 text-[#82889A] mb-3" />
                         <h3 className="text-sm font-bold text-white mb-1">Your wallet is empty</h3>
                         <p className="text-xs text-[#82889A]">Add your first credit card to get started with optimizer.</p>
                     </div>
                )}
            </div>

            {/* Bottom Add Card dashed border pill button */}
            <button 
                onClick={() => {
                    if (isDemo) {
                        setShowDemoRestriction(true);
                    } else {
                        setShowAddCardModal(true);
                    }
                }} 
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-[#1E2538] hover:border-blue-500/50 hover:bg-blue-500/5 text-sm font-bold text-[#82889A] hover:text-white transition-all duration-200 mt-4 select-none shrink-0 group"
            >
                <PlusIcon className="h-4 w-4 text-[#82889A] group-hover:text-white transition-colors" />
                Add New Card
            </button>
        </div>
    );
}
