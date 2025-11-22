'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-secondary/30 z-[100] origin-left"
      style={{ scaleX }}
    >
      <motion.div
        className="h-full bg-linear-to-r from-secondary to-secondary/80 shadow-lg shadow-secondary/50"
        style={{ scaleX }}
      />
    </motion.div>
  );
}

