'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, X, Send, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConciergeResponse {
  message: string;
  tool_calls?: boolean;
}

export function DamaGenie() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedChips, setSuggestedChips] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user } = useAuth();

  // Extract property slug from pathname if on property page
  const propertySlug = pathname?.match(/\/properties\/([^\/]+)/)?.[1] || null;

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Check if premium feature is available
      // TODO: Replace with actual subscription check
      const isPremiumFeatureAvailable = false;

      if (!isPremiumFeatureAvailable) {
        const welcomeMessage: Message = {
          role: 'assistant',
          content: `مرحباً${user ? ` ${user.name}` : ''}! 👋\n\nأنا Dama Genie، مساعدك الذكي في العقارات.\n\n⚠️ هذه الخدمة غير متوفرة حالياً. ستكون متاحة قريباً.`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } else {
        const welcomeMessage: Message = {
          role: 'assistant',
          content: `Hello${user ? ` ${user.name}` : ''}! 👋 I'm Dama Genie, your AI real estate consultant. How can I help you today?`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        updateSuggestedChips();
      }
    }
  }, [isOpen, user]);

  // Update suggested chips based on context
  const updateSuggestedChips = () => {
    const chips: string[] = [];
    
    if (propertySlug) {
      chips.push('Is this property available?');
      chips.push('What is the total price?');
      chips.push('Book a tour');
      chips.push('Contact the agent');
    } else {
      chips.push('Find apartments in Malki');
      chips.push('Show me cheap properties');
      chips.push('I need a 2 bedroom flat');
      chips.push('Properties with pool');
    }
    
    setSuggestedChips(chips);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if premium feature is available
    // TODO: Replace with actual subscription check
    const isPremiumFeatureAvailable = false;

    if (!isPremiumFeatureAvailable) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '⚠️ عذراً، هذه الخدمة غير متوفرة حالياً. ستكون متاحة قريباً.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history
      // CSRF cookie is handled automatically by axios interceptor
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axiosInstance.post<ConciergeResponse>('/ai-concierge/chat', {
        message: userMessage.content,
        conversation_history: conversationHistory,
        current_page: pathname,
        property_slug: propertySlug,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      updateSuggestedChips();
    } catch (error: any) {
      console.error('Concierge Error:', error);
      // Check if error is about premium feature
      const errorContent = error.response?.data?.error || error.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      if (errorContent.includes('غير متوفرة') || errorContent.includes('premium') || errorContent.includes('subscription')) {
        const errorMessage: Message = {
          role: 'assistant',
          content: errorContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: errorContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = async (chip: string) => {
    // Check if premium feature is available
    // TODO: Replace with actual subscription check
    const isPremiumFeatureAvailable = false;

    if (!isPremiumFeatureAvailable) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '⚠️ عذراً، هذه الخدمة غير متوفرة حالياً. ستكون متاحة قريباً.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: chip,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // CSRF cookie is handled automatically by axios interceptor
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axiosInstance.post<ConciergeResponse>('/ai-concierge/chat', {
        message: chip,
        conversation_history: conversationHistory,
        current_page: pathname,
        property_slug: propertySlug,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      updateSuggestedChips();
    } catch (error: any) {
      console.error('Concierge Error:', error);
      // Check if error is about premium feature
      const errorContent = error.response?.data?.error || error.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      if (errorContent.includes('غير متوفرة') || errorContent.includes('premium') || errorContent.includes('subscription')) {
        const errorMessage: Message = {
          role: 'assistant',
          content: errorContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: errorContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg',
          'bg-linear-to-br from-primary to-secondary text-white',
          'flex items-center justify-center',
          'hover:scale-110 transition-transform duration-200',
          'focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2',
          isOpen && 'hidden'
        )}
        aria-label="Open Dama Genie"
      >
        <Sparkles className="w-8 h-8" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm md:w-96 h-[600px] flex flex-col rounded-lg shadow-2xl overflow-hidden">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border border-white/20" />
          
          {/* Content */}
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Dama Genie</h3>
                  <p className="text-xs text-gray-500">AI Real Estate Consultant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <p className="text-sm text-gray-600">Dama Genie is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips */}
            {suggestedChips.length > 0 && !loading && (
              <div className="px-4 py-2 border-t border-gray-200/50 bg-white/50">
                <div className="flex flex-wrap gap-2">
                  {suggestedChips.map((chip, index) => (
                    <button
                      key={index}
                      onClick={() => handleChipClick(chip)}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200/50 bg-white/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

