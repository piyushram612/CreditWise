// FILE: app/components/dashboard/AiCardAdvisor.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { Card, Message } from '@/lib/types';
import { BotIcon, UserIcon, SendIcon } from '@/components/icons';

export default function AiCardAdvisor({ cards }: { cards: Card[] }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsGenerating(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, cards }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages([...newMessages, { role: 'assistant', content: data.response }]);
            } else {
                throw new Error(data.error || 'Failed to get response.');
            }
        } catch (error: any) {
            setMessages([...newMessages, { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">AI Card Advisor</h1>
            <p className="text-gray-400 mb-6">Ask me anything about your credit cards.</p>
            
            <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 p-8">
                            <BotIcon className="h-12 w-12 mx-auto text-gray-500" />
                            <p className="mt-4">Ask a question to get started, like "Which card is best for flights?" or "Summarize the benefits of my HDFC card."</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && <div className="p-2 bg-indigo-600 rounded-full"><BotIcon className="h-5 w-5 text-white" /></div>}
                            <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <div className="p-2 bg-gray-600 rounded-full"><UserIcon className="h-5 w-5 text-white" /></div>}
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-600 rounded-full"><BotIcon className="h-5 w-5 text-white" /></div>
                            <div className="max-w-lg p-3 rounded-lg bg-gray-700 text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your question..."
                    className="flex-1 bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button type="submit" disabled={isGenerating} className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 transition-colors">
                    <SendIcon className="h-6 w-6 text-white" />
                </button>
            </form>
        </div>
    );
}