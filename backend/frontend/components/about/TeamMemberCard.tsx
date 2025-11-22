'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/types';
import { MessageCircle, Phone, Info } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TeamMemberDetails } from './TeamMemberDetails';

interface TeamMemberCardProps {
  agent: Agent;
}

export function TeamMemberCard({ agent }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getWhatsAppLink = (phone: string | undefined | null) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : '#';
  };

  const photoUrl = agent.photo
    ? agent.photo.startsWith('http')
      ? agent.photo
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${agent.photo}`
    : null;

  return (
    <motion.div
      className="relative group w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Vertical Card - Portrait Aspect Ratio (3:4) */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Container - Portrait 3:4 Aspect Ratio */}
        <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={agent.name}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isHovered ? 'scale-110' : 'scale-100'
              )}
              loading="lazy"
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="text-6xl font-bold text-secondary/30">
                {agent.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Overlay for Social Icons - Appears on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center gap-4"
              >
                {/* WhatsApp */}
                {agent.phone && (
                  <motion.a
                    href={getWhatsAppLink(agent.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </motion.a>
                )}

                {/* Phone */}
                {agent.phone && (
                  <motion.a
                    href={`tel:${agent.phone}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                    aria-label="Phone"
                  >
                    <Phone className="w-6 h-6" />
                  </motion.a>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Name and Role - Below Image */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-primary mb-1">{agent.name}</h3>
          {agent.role && (
            <p className="text-secondary font-semibold mb-2">{agent.role}</p>
          )}
          {agent.languages && agent.languages.length > 0 && (
            <p className="text-sm text-slate-600">
              {agent.languages.join(', ')}
            </p>
          )}
          {agent.license_no && (
            <p className="text-xs text-slate-500 mt-2">
              License: {agent.license_no}
            </p>
          )}

          {/* View Details Button */}
          <button
            onClick={() => setDetailsOpen(true)}
            className="mt-4 w-full px-4 py-2 text-sm font-semibold text-secondary hover:text-white hover:bg-secondary border border-secondary rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>

      {/* Team Member Details Modal */}
      <TeamMemberDetails
        agent={agent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </motion.div>
  );
}
