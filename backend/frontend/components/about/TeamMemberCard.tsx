'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/types';
import { Linkedin, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';

interface TeamMemberCardProps {
  agent: Agent;
}

export function TeamMemberCard({ agent }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Portrait Card */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-[#0F172A]">
        {/* Image */}
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={agent.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            quality={90}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
            <div className="text-6xl font-bold text-[#B49162]/30">
              {agent.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
          {agent.role && (
            <p className="text-[#B49162] font-semibold mb-2">{agent.role}</p>
          )}
          {agent.languages && agent.languages.length > 0 && (
            <p className="text-sm text-gray-300">
              Languages: {agent.languages.join(', ')}
            </p>
          )}
        </div>

        {/* Social Links Overlay - Appears on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#0F172A]/90 flex items-center justify-center gap-4"
            >
              {/* WhatsApp */}
              {agent.phone && (
                <motion.a
                  href={getWhatsAppLink(agent.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
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
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 bg-[#B49162] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Phone className="w-6 h-6" />
                </motion.a>
              )}

              {/* License Badge */}
              {agent.license_no && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="absolute top-4 right-4 bg-[#B49162] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                >
                  Licensed: {agent.license_no}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

