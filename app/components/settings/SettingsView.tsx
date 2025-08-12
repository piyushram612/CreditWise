import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsView() {
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
}