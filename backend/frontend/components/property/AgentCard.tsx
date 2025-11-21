'use client';

import { Agent, Property } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

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
    <Card className="shadow-lg border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Agent Photo */}
          <div className="relative">
            {agent.photo ? (
              <Image
                src={agent.photo}
                alt={agent.name}
                width={100}
                height={100}
                className="rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {agent.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Agent Info */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-primary">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.role}</p>
            {agent.languages && agent.languages.length > 0 && (
              <p className="text-xs text-gray-500">
                Speaks: {agent.languages.join(', ')}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 w-full">
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <a
                href={getWhatsAppLink(agent.phone, agent.name, property.reference_id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <a href={`tel:${agent.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

