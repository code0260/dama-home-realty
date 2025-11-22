'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
// Simple toast notification - replace with a proper toast library
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

interface SubscribeFormProps {
  className?: string;
}

export function SubscribeForm({ className }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
      showToast('Successfully subscribed to our newsletter!', 'success');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }, 1000);
  };

  return (
    <Card className={cn('border-2 border-secondary/20 bg-linear-to-br from-secondary/5 to-secondary/10', className)}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-secondary/10 rounded-full">
            <Mail className="w-6 h-6 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary dark:text-white">
            Subscribe to Newsletter
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          Get the latest articles, news, and real estate insights delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
              Thank you for subscribing!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You'll receive our latest articles and updates in your inbox.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subscribe-email" className="text-sm font-semibold text-primary dark:text-white">
                Email Address
              </label>
              <Input
                id="subscribe-email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

