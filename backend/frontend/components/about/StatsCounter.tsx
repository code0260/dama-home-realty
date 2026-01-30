'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Home, Award, Calendar } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: Home,
    value: 100,
    suffix: '+',
    label: 'Properties',
  },
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Clients',
  },
  {
    icon: Calendar,
    value: 5,
    suffix: '',
    label: 'Years',
  },
];

function useCountAnimation(end: number, duration: number, start: number = 0): number {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, end, duration, start]);

  return count;
}

function Counter({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  const count = useCountAnimation(stat.value, 2000);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
      </div>
      <motion.div
        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3"
        key={count}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {count}{stat.suffix}
      </motion.div>
      <p className="text-lg md:text-xl text-white/90 font-medium">{stat.label}</p>
    </motion.div>
  );
}

export function StatsCounter() {
  return (
    <section className="py-20 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Damascene Heritage Pattern - Subtle Islamic/Geometric Arabesque */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='damascene' x='0' y='0' width='120' height='120' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L73.5 20L96 20L78 35L91.5 55L60 45L28.5 55L42 35L24 20L46.5 20Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M0 60L20 46.5L20 24L35 42L55 28.5L45 60L55 91.5L35 78L20 96L20 73.5Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M60 120L46.5 100L24 100L42 85L28.5 65L60 75L91.5 65L78 85L96 100L73.5 100Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M120 60L100 73.5L100 96L85 78L65 91.5L75 60L65 28.5L85 42L100 24L100 46.5Z' fill='%23B49162' opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='8' fill='%23B49162' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23damascene)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Additional subtle geometric overlay for depth */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hexagon' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 0L60 10L60 30L40 40L20 30L20 10Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M40 40L60 50L60 70L40 80L20 70L20 50Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hexagon)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16"
        >
          Our Impact in Numbers
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Counter key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
