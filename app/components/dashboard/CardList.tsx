import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Card } from '../../../lib/types';
import { PlusIcon, EditIcon, TrashIcon, CreditCardIcon } from '../icons';

interface AddCardModalProps {
    allCards: Card[];
    onCardAdded: () => void;
    onClose: () => void;
}

const AddCardModal = ({ allCards, onCardAdded, onClose }: AddCardModalProps) => {
    const [selectedCardId, setSelectedCardId] = useState('');
    const [creditLimit, setCreditLimit] = useState('');
    const [amountUsed, setAmountUsed] = useState('');
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !selectedCardId || !creditLimit) return;

        const { error } = await supabase.from('user_cards').insert({
            user_id: user.id,
            card_details_id: parseInt(selectedCardId),
            credit_limit: parseFloat(creditLimit),
            amount_used: parseFloat(amountUsed) || 0,
        });

        if (error) {
            alert('Error adding card: ' + error.message);
        } else {
            alert('Card added successfully!');
            onCardAdded();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add a New Card</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Card</label>
                        <select value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded">
                            <option value="">Select a card</option>
                            {allCards.map((card) => (
                                <option key={card.id} value={card.id}>{card.card_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credit Limit</label>
                        <input type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Amount Used (Optional)</label>
                        <input type="number" value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600">Add Card</button>
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
}

const EditCardModal = ({ card, onCardUpdated, onClose }: EditCardModalProps) => {
    const [creditLimit, setCreditLimit] = useState(card.credit_limit.toString());
    const [amountUsed, setAmountUsed] = useState(card.amount_used.toString());
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from('user_cards').update({
            credit_limit: parseFloat(creditLimit),
            amount_used: parseFloat(amountUsed),
        }).eq('id', card.id);

        if (error) {
            alert('Error updating card: ' + error.message);
        } else {
            alert('Card updated!');
            onCardUpdated();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit {card.card_name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credit Limit</label>
                        <input type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Amount Used</label>
                        <input type="number" value={amountUsed} onChange={(e) => setAmountUsed(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600">Update Card</button>
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
}

export default function CardList({ cards, onCardUpdate, allCards }: CardListProps) {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const supabase = createClientComponentClient();

    const handleDelete = async (cardId: number) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        
        const { error } = await supabase.from('user_cards').delete().eq('id', cardId);
        if (error) {
            alert('Error deleting card: ' + error.message);
        } else {
            alert('Card deleted.');
            onCardUpdate();
        }
    };

    return (
        <div>
            {showAddCardModal && <AddCardModal allCards={allCards} onCardAdded={onCardUpdate} onClose={() => setShowAddCardModal(false)} />}
            {editingCard && <EditCardModal card={editingCard} onCardUpdated={onCardUpdate} onClose={() => setEditingCard(null)} />}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Your Cards</h2>
                <button onClick={() => setShowAddCardModal(true)} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors">
                    <PlusIcon className="h-5 w-5 text-white" />
                </button>
            </div>
            <div className="space-y-4">
                {cards.length > 0 ? cards.map(card => (
                    <div key={card.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-white">{card.card_name}</p>
                                <p className="text-sm text-gray-400">{card.card_issuer}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => setEditingCard(card)} className="p-1 text-gray-400 hover:text-white"><EditIcon className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(card.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Used: ₹{card.amount_used.toLocaleString()}</span>
                                <span>Limit: ₹{card.credit_limit.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(card.amount_used / card.credit_limit) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-10 px-4 border-2 border-dashed border-gray-700 rounded-lg">
                        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-white">No cards yet</h3>
                        <p className="mt-1 text-sm text-gray-400">Add your first credit card to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}