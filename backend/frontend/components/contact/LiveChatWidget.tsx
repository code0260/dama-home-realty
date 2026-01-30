'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Clock,
  Check,
  CheckCheck,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  read?: boolean;
}

interface QuickResponse {
  text: string;
  id: string;
}

interface LiveChatWidgetProps {
  className?: string;
}

const quickResponses: QuickResponse[] = [
  { id: '1', text: 'Hi, I need help finding a property' },
  { id: '2', text: 'What are your office hours?' },
  { id: '3', text: 'Can I schedule a viewing?' },
  { id: '4', text: 'Do you have properties in Damascus?' },
];

const availabilityStatus = {
  online: { text: 'Online', color: 'bg-green-500' },
  away: { text: 'Away', color: 'bg-yellow-500' },
  offline: { text: 'Offline', color: 'bg-gray-500' },
};

export function LiveChatWidget({ className }: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      read: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [availability, setAvailability] = useState<'online' | 'away' | 'offline'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Check availability (mock)
  useEffect(() => {
    const checkAvailability = () => {
      const hour = new Date().getHours();
      if (hour >= 9 && hour < 18) {
        setAvailability('online');
      } else if (hour >= 18 && hour < 20) {
        setAvailability('away');
      } else {
        setAvailability('offline');
      }
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. Our team will get back to you shortly. In the meantime, feel free to browse our properties or contact us via phone.",
        sender: 'bot',
        timestamp: new Date(),
        read: true,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (response: QuickResponse) => {
    setInputValue(response.text);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (sender: string) => {
    if (sender === 'bot' || sender === 'agent') return 'DH';
    return 'U';
  };

  return (
    <div className={cn('fixed bottom-20 right-4 md:bottom-4 md:right-4 z-50', className)}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-xl"
            size="icon"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Unread Badge */}
            {messages.some((m) => m.sender !== 'user' && !m.read) && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
            )}
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'absolute bottom-0 right-0 w-80 md:w-96 h-[600px] md:h-[650px] flex flex-col',
              isMinimized && 'h-16'
            )}
          >
            <Card className="h-full flex flex-col shadow-2xl border-2 border-gray-200 dark:border-primary-700">
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b border-gray-200 dark:border-primary-700 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-secondary/10 text-secondary">
                          {getInitials('bot')}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                          availabilityStatus[availability].color
                        )}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-primary dark:text-white">
                        Dama Home Support
                      </CardTitle>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {availabilityStatus[availability].text}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      {isMinimized ? (
                        <Maximize2 className="w-4 h-4" />
                      ) : (
                        <Minimize2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  {/* Chat Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Quick Responses */}
                    {messages.length === 1 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Quick responses:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {quickResponses.map((response) => (
                            <Button
                              key={response.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickResponse(response)}
                              className="text-xs h-auto py-1.5 px-2"
                            >
                              {response.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'flex gap-2',
                          message.sender === 'user' && 'flex-row-reverse'
                        )}
                      >
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback
                            className={cn(
                              'text-xs',
                              message.sender === 'user'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-primary/10 text-primary'
                            )}
                          >
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'flex flex-col gap-1 max-w-[75%]',
                            message.sender === 'user' && 'items-end'
                          )}
                        >
                          <div
                            className={cn(
                              'rounded-lg px-3 py-2 text-sm',
                              message.sender === 'user'
                                ? 'bg-secondary text-white'
                                : 'bg-gray-100 dark:bg-primary-800 text-gray-900 dark:text-white'
                            )}
                          >
                            {message.text}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatTime(message.timestamp)}</span>
                            {message.sender === 'user' && (
                              <>
                                {message.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-500" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-primary-800 rounded-lg px-3 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </CardContent>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-primary-700 flex-shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={availability === 'offline'}
                      />
                      <Button
                        type="submit"
                        disabled={!inputValue.trim() || availability === 'offline'}
                        className="bg-secondary hover:bg-secondary/90"
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                    {availability === 'offline' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        We're currently offline. Leave a message and we'll get back to you.
                      </p>
                    )}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

