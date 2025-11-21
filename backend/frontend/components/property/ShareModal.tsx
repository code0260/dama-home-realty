'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { Property } from '@/types';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
}

export function ShareModal({ open, onOpenChange, property }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this property: ${property.title}`;
  const shareUrl = encodeURIComponent(currentUrl);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(currentUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
            <Share2 className="w-6 h-6 text-[#B49162]" />
            Share Property
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Property Preview */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 bg-linear-to-br from-[#0F172A]/20 to-[#B49162]/20 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#0F172A] line-clamp-2 mb-1">{property.title}</h3>
              <p className="text-sm text-gray-600 truncate">{property.neighborhood?.name || 'Damascus'}</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleShare(link.url)}
                    className={`w-full ${link.color} text-white`}
                    variant="default"
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {link.name}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Or copy link</label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 truncate">
                {currentUrl}
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="border-[#B49162] text-[#B49162] hover:bg-[#B49162] hover:text-white"
                  size="icon"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="link"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LinkIcon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-600"
              >
                Link copied to clipboard!
              </motion.p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

