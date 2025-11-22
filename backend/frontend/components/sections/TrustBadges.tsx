'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Clock, CheckCircle2 } from 'lucide-react';

interface Badge {
  icon: React.ReactNode;
  label: string;
  description: string;
}

const badges: Badge[] = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    label: 'Verified',
    description: 'All properties verified',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    label: 'Secure',
    description: 'Safe transactions',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    label: '24/7',
    description: 'Always available',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    label: 'Trusted',
    description: '10+ years experience',
  },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-colors duration-300 group"
        >
          <div className="text-secondary group-hover:scale-110 transition-transform duration-300">
            {badge.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">
              {badge.label}
            </span>
            <span className="text-xs text-white/80 leading-tight">
              {badge.description}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

