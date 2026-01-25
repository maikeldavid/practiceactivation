import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { initChat, sendMessage } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { MessageSquareIcon, XIcon, SendIcon, ThumbsUpIcon, ThumbsDownIcon } from './IconComponents';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: `initial-${Date.now()}`, role: 'model', text: 'Hello! How can I help you with ITERA HEALTH today?', feedback: null }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [isProactive, setIsProactive] = useState(false);

    const suggestions = ["What is CCM?", "Tell me about implementation", "How does billing work?"];

    // Proactive engagement timer
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setIsProactive(true);
            }
        }, 10000); // 10 seconds

        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsProactive(false); // Hide proactive prompt when chat is opened
            if (!chatRef.current) {
                try {
                    chatRef.current = initChat();
                } catch (error) {
                    console.error("Failed to initialize chat:", error);
                    setMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'model', text: 'Sorry, I am unable to connect right now.' }]);
                }
            }
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText: string = input) => {
        if (!messageText.trim() || isLoading || !chatRef.current) return;

        setShowSuggestions(false);
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await sendMessage(chatRef.current, messageText);

        const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: 'model', text: responseText, feedback: null };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        handleSend(suggestion);
    };

    const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, feedback } : msg
            )
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                {isProactive && !isOpen && (
                    <div className="absolute bottom-full right-0 mb-3 w-max bg-itera-blue-dark text-white text-sm font-semibold py-2 px-4 rounded-lg rounded-br-none shadow-lg animate-fade-in-up">
                        Have a question?
                        <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-itera-blue-dark -mb-2"></div>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`bg-itera-blue text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform ${isProactive && !isOpen ? 'animate-pulse-chat' : ''}`}
                    aria-label="Open chat"
                >
                    {isOpen ? <XIcon className="w-8 h-8" /> : <MessageSquareIcon className="w-8 h-8" />}
                </button>
            </div>

            <div className={`fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-sm h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-itera-blue-dark text-white p-4 rounded-t-2xl flex items-center">
                    <img src="/assets/aida-avatar.png" alt="AIDA" className="w-10 h-10 rounded-full mr-3 border-2 border-white" />
                    <div>
                        <h3 className="text-lg font-semibold">AIDA</h3>
                        <p className="text-xs text-blue-200">ITERA HEALTH Assistant</p>
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-itera-blue-light/30">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {msg.role === 'model' && (
                                        <img src="/assets/aida-avatar.png" alt="AIDA" className="w-8 h-8 rounded-full flex-shrink-0" />
                                    )}
                                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-xl ${msg.role === 'user' ? 'bg-itera-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        {msg.role === 'model' && (
                                            <div className="mt-2 h-6"> {/* Fixed height to prevent layout shifts */}
                                                {msg.feedback === null ? (
                                                    <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                                        <button onClick={() => handleFeedback(msg.id, 'like')} className="p-1 text-gray-400 hover:text-itera-blue transition-colors" aria-label="Good response">
                                                            <ThumbsUpIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleFeedback(msg.id, 'dislike')} className="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label="Bad response">
                                                            <ThumbsDownIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 animate-fade-in-up">
                                                        {msg.feedback === 'like' && <ThumbsUpIcon className="w-4 h-4 text-itera-blue" />}
                                                        {msg.feedback === 'dislike' && <ThumbsDownIcon className="w-4 h-4 text-red-500" />}
                                                        <span>Thank you for your feedback!</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-xl bg-gray-200 text-gray-800">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {showSuggestions && (
                    <div className="p-2 border-t border-gray-200 bg-white">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => handleSuggestionClick(s)} className="text-xs bg-itera-blue-light text-itera-blue-dark font-semibold py-1.5 px-3 rounded-full hover:bg-itera-blue/20 transition-colors">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-itera-blue"
                            disabled={isLoading}
                        />
                        <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-3 bg-itera-blue text-white rounded-lg disabled:bg-gray-400">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;