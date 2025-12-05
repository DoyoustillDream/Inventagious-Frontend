'use client';

import { useState, useRef, useEffect } from 'react';
import { helpApi } from '@/lib/api/help';
import { findBestMatch, getContextualSuggestions, type KnowledgeBaseEntry } from '@/lib/help/knowledge-base';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  suggestions?: string[];
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! 👋 I'm your AI assistant for Inventagious, the crowdfunding and private fundraising platform built on Solana.

I can help you with:
• Starting and managing projects
• Understanding pricing and fees
• Payment methods and transactions
• Platform features and guarantees
• Security and trust questions
• And much more!

What would you like to know?`,
      isUser: false,
      suggestions: [
        'How do I start a project?',
        'How much does it cost?',
        'Do I need to give up equity?',
        'What payment methods are accepted?',
        'How do I get paid?',
        'Is Inventagious safe?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or retrieve session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('chat_session_id');
      if (!storedSessionId) {
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_session_id', storedSessionId);
      }
      setSessionId(storedSessionId);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // First, try to find a match in our knowledge base
    const knowledgeMatch = findBestMatch(messageText);
    
    try {
      // Try to get response from backend AI
      const response = await helpApi.chat(messageText, sessionId);
      
      // Check if the response is helpful or just a generic fallback
      const responseText = response.response || '';
      const isGenericResponse = 
        responseText.includes('Hello! I am here to help') ||
        responseText.includes('Financial Overview') ||
        responseText.includes('Total Raised:') ||
        responseText.length < 50 ||
        (!responseText.includes('Inventagious') && !responseText.includes('project') && !responseText.includes('SOL'));
      
      // If we have a knowledge base match and the AI response is generic, use knowledge base
      if (knowledgeMatch && isGenericResponse) {
        const kbMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: knowledgeMatch.answer,
          isUser: false,
          suggestions: knowledgeMatch.suggestions || getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, kbMessage]);
      } else if (responseText && !isGenericResponse) {
        // Use AI response if it's helpful
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          suggestions: response.suggestions || getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else if (knowledgeMatch) {
        // Fallback to knowledge base if AI response is not helpful
        const kbMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: knowledgeMatch.answer,
          isUser: false,
          suggestions: knowledgeMatch.suggestions || getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, kbMessage]);
      } else {
        // No good match, provide helpful fallback
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'm here to help with questions about Inventagious! I can help you with:\n\n• Starting a project\n• Pricing and fees\n• Payment methods\n• Platform features\n• Security and guarantees\n\nTry asking something like "How do I start a project?" or "How much does it cost?"\n\nFor more detailed help, visit our Help Center at /help or contact support@inventagious.com`,
          isUser: false,
          suggestions: getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Use knowledge base as fallback on error
      if (knowledgeMatch) {
        const kbMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: knowledgeMatch.answer,
          isUser: false,
          suggestions: knowledgeMatch.suggestions || getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, kbMessage]);
      } else {
        // No knowledge base match, provide helpful error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I'm having trouble connecting right now, but I can still help!\n\nHere are some common questions I can answer:\n\n• "How do I start a project?"\n• "How much does it cost?"\n• "Do I need to give up equity?"\n• "What payment methods are accepted?"\n\nOr visit our Help Center at /help for detailed guides.\n\nFor urgent issues, contact support@inventagious.com`,
          isUser: false,
          suggestions: getContextualSuggestions(messageText),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-none">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto browser-window bg-yellow-400 hover:bg-yellow-500 transition-all shadow-lg hover:scale-105 active:scale-95"
          aria-label="Open help chat"
        >
          <div className="p-4">
            <svg className="h-6 w-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto browser-window w-[calc(100vw-3rem)] sm:w-96 h-[600px] max-h-[85vh] flex flex-col bg-white shadow-2xl">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              AI HELP CHAT
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 text-black hover:text-gray-600"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 ${
                    message.isUser
                      ? 'bg-yellow-400 text-black border-2 border-black'
                      : 'bg-white text-black border-2 border-black'
                  }`}
                >
                  <p className="hand-drawn text-sm font-bold whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left border-2 border-black bg-white hover:bg-yellow-50 px-3 py-2 hand-drawn text-xs font-bold text-black transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-black p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-black p-4 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 border-2 border-black px-4 py-2 hand-drawn text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="border-2 border-black bg-black text-white px-4 py-2 hand-drawn text-sm font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

