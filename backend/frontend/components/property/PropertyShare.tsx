'use client';

import { useState, useEffect } from 'react';
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
import { 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Printer,
  QrCode,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as QRCodeLib from 'qrcode';

interface PropertyShareProps {
  property: Property;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function PropertyShare({ property, open: controlledOpen, onOpenChange, className }: PropertyShareProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/properties/${property.slug}`
    : '';
  
  const shareText = `Check out this property: ${property.title}`;

  useEffect(() => {
    if (isOpen && shareUrl) {
      // Generate QR code
      QRCodeLib.toDataURL(shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF',
        },
      })
        .then((url: string) => setQrCodeUrl(url))
        .catch((err: Error) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, shareUrl]);

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

  const printProperty = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${property.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #0F172A; }
              .info { margin: 20px 0; }
              .price { font-size: 24px; font-weight: bold; color: #B49162; }
            </style>
          </head>
          <body>
            <h1>${property.title}</h1>
            <div class="info">
              <p><strong>Location:</strong> ${property.neighborhood?.name || 'Damascus'}</p>
              <p><strong>Price:</strong> <span class="price">$${property.price?.toLocaleString() || 'N/A'}</span></p>
              <p><strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'}</p>
              <p><strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'}</p>
              <p><strong>Area:</strong> ${property.area_sqm || 'N/A'} m²</p>
            </div>
            <p><strong>Description:</strong></p>
            <p>${property.description || 'No description available'}</p>
            <hr>
            <p><small>From: Dama Home Realty</small></p>
            <p><small>URL: ${shareUrl}</small></p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${property.slug}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-10 w-10 rounded-full', className)}
            aria-label="Share property"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-secondary" />
            Share Property
          </DialogTitle>
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

          {/* Print & QR Code */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-primary-700">
            <Button
              variant="outline"
              onClick={printProperty}
              className="w-full justify-start"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="w-full justify-start"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="pt-4 border-t border-gray-200 dark:border-primary-700 text-center">
              <div className="inline-block p-4 bg-white dark:bg-primary-800 rounded-lg border border-gray-200 dark:border-primary-700">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Scan to view property
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

