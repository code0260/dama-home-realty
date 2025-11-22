'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { isOnline } from '@/lib/mobile';
import { cn } from '@/lib/utils';

/**
 * Offline/Online indicator component
 */
export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const handleOnline = () => {
      setOnline(true);
      setWasOffline(true);
      // Hide "back online" message after 3 seconds
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    const handleOffline = () => {
      setOnline(false);
      setWasOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-3 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">No internet connection. Some features may be unavailable.</span>
          </div>
        </motion.div>
      )}
      {wasOffline && online && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-3 text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto flex items-center justify-center gap-2">
            <Wifi className="w-5 h-5" />
            <span className="font-medium">Back online. All features are available.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

