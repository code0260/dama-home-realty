'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
  Copy,
  Check,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Simple toast notification - replace with a proper toast library like react-hot-toast or sonner
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    // Create a simple toast notification
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

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({ url, title, description, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const shareText = title;
  const shareDescription = description || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedDescription = encodeURIComponent(shareDescription);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedText}&summary=${encodedDescription}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedDescription}%20${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const ShareButtonContent = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => handleShare('facebook')}
          className="flex-1 min-w-[120px]"
        >
          <Facebook className="w-4 h-4 mr-2 text-blue-600" />
          Facebook
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('twitter')}
          className="flex-1 min-w-[120px]"
        >
          <Twitter className="w-4 h-4 mr-2 text-sky-500" />
          Twitter
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('linkedin')}
          className="flex-1 min-w-[120px]"
        >
          <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('whatsapp')}
          className="flex-1 min-w-[120px]"
        >
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          onClick={() => handleShare('email')}
          className="flex-1 min-w-[120px]"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
      </div>

      {/* Copy Link */}
      <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-primary-800 rounded-lg">
        <Link2 className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Desktop - Inline Buttons */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-5 h-5 text-secondary" />
          <h3 className="text-lg font-semibold text-primary dark:text-white">Share</h3>
        </div>
        <ShareButtonContent />
      </div>

      {/* Mobile - Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share Article
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Article</DialogTitle>
            <DialogDescription>
              Share this article with your friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <ShareButtonContent />
        </DialogContent>
      </Dialog>
    </div>
  );
}

