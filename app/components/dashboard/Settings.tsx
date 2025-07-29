import React, { useState } from 'react';

export default function Settings() {
    const [feedback, setFeedback] = useState('');
    const [requestedCard, setRequestedCard] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState('');

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback }),
            });
            setFeedback('');
            setShowSuccessMessage('Feedback submitted successfully!');
            setTimeout(() => setShowSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to submit feedback.');
        }
    };

    const handleRequestCardSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/request-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardName: requestedCard }),
            });
            setRequestedCard('');
            setShowSuccessMessage('Card request submitted successfully!');
            setTimeout(() => setShowSuccessMessage(''), 3000);
        } catch (error) {
            alert('Failed to submit card request.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            
            {showSuccessMessage && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded-lg mb-6 text-center">
                    {showSuccessMessage}
                </div>
            )}

            <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Request a New Card</h2>
                    <p className="text-gray-400 mb-4">Can&apos;t find your card in our database? Let us know and we&apos;ll add it.</p>
                    <form onSubmit={handleRequestCardSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={requestedCard}
                            onChange={(e) => setRequestedCard(e.target.value)}
                            placeholder="e.g., SBI SimplyCLICK Credit Card"
                            className="w-full bg-gray-700 text-white p-2 rounded"
                        />
                        <button type="submit" className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700">Submit Request</button>
                    </form>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Submit Feedback</h2>
                    <p className="text-gray-400 mb-4">Have suggestions or found a bug? We&apos;d love to hear from you.</p>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Your feedback..."
                            rows={4}
                            className="w-full bg-gray-700 text-white p-2 rounded"
                        />
                        <button type="submit" className="w-full px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700">Submit Feedback</button>
                    </form>
                </div>
            </div>
        </div>
    );
}