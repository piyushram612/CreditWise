'use client';
import React, { useState, useRef, useEffect } from 'react';
import type { Card, Message } from '../../../lib/types';
import { BotIcon, UserIcon } from '../icons';

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

        const userText = input;
        setInput('');
        await triggerChat(userText);
    };

    const triggerChat = async (text: string) => {
        const newMessages: Message[] = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setIsGenerating(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, cards }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply || data.response }]);
            } else {
                throw new Error(data.error || 'Failed to get response.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setMessages([...newMessages, { role: 'assistant', content: `Sorry, I encountered an error: ${errorMessage}` }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (isGenerating) return;
        triggerChat(suggestion);
    };

    const renderFormattedContent = (content: string) => {
        // Standard markdown bold parser
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const lower = content.toLowerCase();
        
        return (
            <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-300">
                    {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
                
                {/* Visual Card Recommendation Badge matches mockup */}
                {(lower.includes('flight') || lower.includes('travel') || lower.includes('london')) && 
                 (lower.includes('sapphire') || lower.includes('infinia') || lower.includes('regalia') || lower.includes('platinum')) && (
                    <div className="bg-[#0E111A] border border-[#1E2538] p-4 rounded-xl flex items-center justify-between mt-3 select-none">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600/15 border border-blue-500/20 p-2.5 rounded-xl text-blue-400 shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm leading-snug">
                                    {content.includes('Infinia') ? 'HDFC Infinia' : content.includes('Regalia') ? 'HDFC Regalia Gold' : content.includes('Platinum') ? 'AMEX Platinum Travel' : 'Sapphire Reserve'}
                                </p>
                                <p className="text-xs text-[#82889A] mt-0.5">
                                    {content.includes('Infinia') ? '10x Reward Points on flights' : content.includes('Regalia') ? '5x Reward Points on travel' : content.includes('Platinum') ? '3x Membership Rewards' : '3x Points on Travel'}
                                </p>
                             </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-emerald-400 font-extrabold text-base leading-none block">
                                {content.includes('Infinia') ? '+1,500' : content.includes('Regalia') ? '+900' : content.includes('Platinum') ? '+1,200' : '+4,350'}
                            </span>
                            <span className="text-[9px] text-[#82889A] font-extrabold tracking-wider block mt-1">POINTS</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto overflow-hidden">
            {/* Scrollable Message History */}
            <div className="flex-1 overflow-y-auto mb-4 pr-1 scrollbar-thin scrollbar-thumb-gray-800 flex flex-col justify-start">
                {messages.length === 0 ? (
                    <div className="my-auto py-12 text-center select-none">
                        {/* Hexagonal/Circular AI icon */}
                        <div className="w-16 h-16 rounded-full bg-[#1E2538] border border-[#2A334B] flex items-center justify-center text-blue-400 mx-auto mb-6 shadow-sm">
                            <BotIcon className="h-8 w-8 text-blue-400 animate-pulse" />
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                            Your AI Financial Advisor
                        </h2>
                        
                        <p className="text-sm text-[#82889A] max-w-sm mx-auto leading-relaxed mb-8">
                            Analyze spending, compare cards, and maximize your rewards effortlessly.
                        </p>

                        {/* Suggestion Chips */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                            <button 
                                onClick={() => handleSuggestionClick("Which card is best for Amazon purchases?")}
                                className="w-full sm:w-auto bg-[#131622] border border-[#1E2538] hover:border-gray-700/50 text-[#82889A] hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none"
                            >
                                <span>🛒</span> Which card for Amazon?
                            </button>
                            <button 
                                onClick={() => handleSuggestionClick("Best card for flights?")}
                                className="w-full sm:w-auto bg-[#131622] border border-[#1E2538] hover:border-gray-700/50 text-[#82889A] hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none"
                            >
                                <span>✈️</span> Best card for flights?
                            </button>
                            <button 
                                onClick={() => handleSuggestionClick("Optimize my dining rewards strategy")}
                                className="w-full sm:w-auto bg-[#131622] border border-[#1E2538] hover:border-gray-700/50 text-[#82889A] hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none"
                            >
                                <span>🍴</span> Optimize dining rewards
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pt-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.1)] select-none">
                                        <BotIcon className="h-5 w-5 text-blue-400" />
                                    </div>
                                )}
                                
                                <div className={`p-5 rounded-2xl shadow-md ${
                                    msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-sm max-w-md font-semibold border border-blue-500/20' 
                                        : 'bg-[#131622]/95 border border-[#1E2538] text-[#D1D5DB] max-w-xl'
                                }`}>
                                    {msg.role === 'user' ? (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    ) : (
                                        renderFormattedContent(msg.content)
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-10 h-10 rounded-full bg-[#1E2538] border border-[#2A334B] flex items-center justify-center text-blue-400 shrink-0 select-none">
                                        <UserIcon className="h-5 w-5 text-blue-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isGenerating && (
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.1)] select-none">
                                    <BotIcon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="p-4 rounded-2xl bg-[#131622]/95 border border-[#1E2538] max-w-xs">
                                    <div className="flex items-center space-x-2 select-none py-1 px-2">
                                        <div className="w-2.5 h-2.5 bg-blue-400/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2.5 h-2.5 bg-blue-400/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2.5 h-2.5 bg-blue-400/80 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Bottom Input Search Bar */}
            <form onSubmit={handleChatSubmit} className="shrink-0 pt-2 pb-1">
                <div className="bg-[#131622]/95 border border-[#1E2538] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg select-none hover:border-gray-700/40 focus-within:border-blue-500/50 transition-all duration-200">
                    <svg className="w-5 h-5 text-[#82889A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L14.857 17.082M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about maximizing rewards, card comparisons..."
                        className="flex-1 bg-transparent text-white placeholder-[#82889A] text-sm focus:outline-none border-none focus:ring-0 p-0"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isGenerating || !input.trim()} 
                        className="bg-blue-600 hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.95] disabled:bg-gray-800 disabled:text-[#82889A] disabled:hover:scale-100 p-2 rounded-full text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}