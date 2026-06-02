'use client';
import React, { useState } from 'react';

export default function Settings() {
    const [feedback, setFeedback] = useState('');
    const [requestedCard, setRequestedCard] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState('');

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;
        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback }),
            });
            setFeedback('');
            setShowSuccessMessage('Feedback submitted successfully!');
            setTimeout(() => setShowSuccessMessage(''), 3000);
        } catch {
            alert('Failed to submit feedback.');
        }
    };

    const handleRequestCardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestedCard.trim()) return;
        try {
            await fetch('/api/request-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardName: requestedCard }),
            });
            setRequestedCard('');
            setShowSuccessMessage('Card request submitted successfully!');
            setTimeout(() => setShowSuccessMessage(''), 3000);
        } catch {
            alert('Failed to submit card request.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {showSuccessMessage && (
                <div className="bg-[#121E18]/60 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center justify-center gap-2.5 select-none shadow-[0_0_12px_rgba(16,185,129,0.05)] animate-pulse">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold tracking-wide">{showSuccessMessage}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Request Card Segment */}
                <div className="bg-[#131622]/90 border border-[#1E2538] p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3 mb-4 text-white border-b border-[#1E2538]/60 pb-4 select-none">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-base font-bold text-white leading-none">Request a New Card</h2>
                    </div>
                    
                    <p className="text-sm text-[#82889A] leading-relaxed mb-5">
                        Can&apos;t find your credit card in our catalog? Provide the issuer and card model name below, and our catalog curators will integrate it within 24 hours.
                    </p>
                    
                    <form onSubmit={handleRequestCardSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={requestedCard}
                            onChange={(e) => setRequestedCard(e.target.value)}
                            placeholder="e.g., SBI SimplyCLICK Credit Card"
                            className="w-full bg-[#0E111A] border border-[#1E2538] text-white placeholder-[#82889A] p-3.5 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-semibold transition-all duration-200"
                        />
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>

                {/* Submit Feedback Segment */}
                <div className="bg-[#131622]/90 border border-[#1E2538] p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3 mb-4 text-white border-b border-[#1E2538]/60 pb-4 select-none">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9s0 0 0 0M7.5 12h9s0 0 0 0m-9 3.75h9s0 0 0 0M5.625 18.75h12.75A1.875 1.875 0 0020.25 16.88V7.125a1.875 1.875 0 00-1.875-1.875H5.625A1.875 1.875 0 003.75 7.125V16.88a1.875 1.875 0 001.875 1.875z" />
                        </svg>
                        <h2 className="text-base font-bold text-white leading-none">Submit Feedback & Bugs</h2>
                    </div>
                    
                    <p className="text-sm text-[#82889A] leading-relaxed mb-5">
                        Have suggestions or run into an issue? Tell us your thoughts to help us optimize CreditWise! We read every submission from our power users.
                    </p>
                    
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Your detailed feedback..."
                            rows={4}
                            className="w-full bg-[#0E111A] border border-[#1E2538] text-white placeholder-[#82889A] p-3.5 rounded-xl focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm font-semibold transition-all duration-200 resize-none"
                        />
                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer select-none"
                        >
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}