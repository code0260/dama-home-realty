'use client';

import { Agent, Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: Agent;
  property: Property;
}

export function AgentCard({ agent, property }: AgentCardProps) {
  const getWhatsAppLink = (phone: string, agentName: string, refId?: string) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Hello ${agentName}, I'm interested in property Ref: ${refId || 'N/A'}. Could you please provide more information?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4">
      {/* Agent Photo - Circle */}
      <div className="flex flex-col items-center">
        <div className="relative">
          {agent.photo ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-secondary/20 ring-offset-2 ring-offset-white">
              <Image
                src={agent.photo}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary ring-4 ring-secondary/20 ring-offset-2 ring-offset-white">
              {agent.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Verified Badge */}
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Agent Name */}
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold text-primary">{agent.name}</h3>
          {agent.role && (
            <p className="text-sm text-gray-600 mt-1">{agent.role}</p>
          )}
          {agent.languages && agent.languages.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Speaks: {agent.languages.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp Button - Large, Green, Pulsing */}
      {agent.phone && (
        <motion.a
          href={getWhatsAppLink(agent.phone, agent.name, property.reference_id ?? undefined)}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(37, 211, 102, 0.7)',
                '0 0 0 10px rgba(37, 211, 102, 0)',
                '0 0 0 0 rgba(37, 211, 102, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full"
          >
            <Button
              className={cn(
                'w-full bg-[#25D366] hover:bg-[#22C55E] text-white',
                'font-bold text-base h-14 rounded-lg',
                'shadow-lg hover:shadow-xl',
                'transition-all duration-200',
                'flex items-center justify-center gap-3'
              )}
              size="lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span>WhatsApp Agent</span>
            </Button>
          </motion.div>
        </motion.a>
      )}

      {/* Call Button */}
      {agent.phone && (
        <Button
          asChild
          variant="outline"
          className="w-full border-gray-300 hover:bg-gray-50 h-12 rounded-lg font-medium"
          size="lg"
        >
          <a href={`tel:${agent.phone}`}>
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </a>
        </Button>
      )}
    </div>
  );
}
