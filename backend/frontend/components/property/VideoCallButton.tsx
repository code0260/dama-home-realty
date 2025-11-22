'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Video, Phone, PhoneOff, Mic, MicOff, VideoOff } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';

interface VideoCallButtonProps {
  property: Property;
  agentPhone?: string;
  className?: string;
}

export function VideoCallButton({ property, agentPhone, className }: VideoCallButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const handleCall = () => {
    // In a real implementation, this would initiate a video call
    // For now, it redirects to WhatsApp or shows a message
    if (agentPhone) {
      const cleanPhone = agentPhone.replace(/\D/g, '');
      const message = encodeURIComponent(
        `Hello, I'd like to schedule a video call to discuss: ${property.title}`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('rounded-full', className)}
          aria-label="Schedule video call"
        >
          <Video className="w-4 h-4 mr-2" />
          Video Call
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary dark:text-white">
            Schedule Video Call
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-gray-600 dark:text-gray-300">
            Schedule a video call with our agent to discuss <strong>{property.title}</strong>
          </p>
          
          {agentPhone ? (
            <div className="space-y-3">
              <Button
                onClick={handleCall}
                className="w-full bg-secondary hover:bg-secondary/90 text-white"
                size="lg"
              >
                <Video className="w-5 h-5 mr-2" />
                Request Video Call via WhatsApp
              </Button>
              <p className="text-xs text-gray-500 text-center">
                We'll contact you via WhatsApp to schedule the call
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Agent contact information not available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

