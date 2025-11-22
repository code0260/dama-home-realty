'use client';

import { useState } from 'react';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SharePropertyProps {
  property: Property;
  className?: string;
}

export function ShareProperty({ property, className }: SharePropertyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/properties/${property.slug}`
    : '';
  
  const shareText = `Check out this property: ${property.title}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-9 w-9 p-0', className)}
          aria-label="Share property"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Property</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* URL Copy */}
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
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

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={shareOnFacebook}
              className="w-full justify-start"
            >
              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={shareOnTwitter}
              className="w-full justify-start"
            >
              <Twitter className="w-4 h-4 mr-2 text-blue-400" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={shareOnWhatsApp}
              className="w-full justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={shareViaEmail}
              className="w-full justify-start"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

