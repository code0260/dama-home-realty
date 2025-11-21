'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionAnimationProps {
  children: ReactNode;
  delay?: number;
}

export function SectionAnimation({ children, delay = 0 }: SectionAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      {children}
    </motion.div>
  );
}

