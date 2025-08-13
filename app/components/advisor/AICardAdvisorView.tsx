import React, { useState, useEffect, useRef } from 'react';
import { apiCall } from '@/app/utils/api';
import type { ChatMessage } from '@/app/types';
import { SparklesIcon, SendIcon } from '@/app/components/shared/Icons';

export function AICardAdvisorView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      from: 'ai', 
      text: "Hi! How can I help you with your cards today? You can ask about rewards, benefits, or anything else." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      const response = await apiCall('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Chat API response:', data);
      
      if (data.error) {
        throw new Error(data.error + (data.details ? ` (${data.details})` : ''));
      }
      
      const aiMessage: ChatMessage = { from: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { 
        from: 'ai', 
        text: "Sorry, I'm having trouble connecting right now." 
      };
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
            <div 
              key={index} 
              className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}
            >
              {msg.from === 'ai' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <SparklesIcon className="w-5 h-5"/>
                </div>
              )}
              <div className={`max-w-xl p-3 rounded-lg ${
                msg.from === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                <SparklesIcon className="w-5 h-5"/>
              </div>
              <div className="max-w-md p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-0"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask about rewards, fees, benefits..." 
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 dark:placeholder-gray-400" 
            disabled={isThinking} 
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300" 
            disabled={isThinking}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}