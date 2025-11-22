'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Home, Users, Calendar, Star } from 'lucide-react';

interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    icon: <Home className="w-8 h-8" />,
    value: 500,
    label: 'Properties',
    suffix: '+',
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 1200,
    label: 'Happy Clients',
    suffix: '+',
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    value: 10,
    label: 'Years of Excellence',
    suffix: '+',
  },
  {
    icon: <Star className="w-8 h-8" />,
    value: 98,
    label: 'Satisfaction Rate',
    suffix: '%',
  },
];

function AnimatedCounter({ 
  value, 
  prefix, 
  suffix,
  duration = 2000 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Only animate once
    if (hasAnimatedRef.current) {
      setCount(value);
      return;
    }

    hasAnimatedRef.current = true;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= value) {
          clearInterval(timer);
          return value;
        }
        return next;
      });
    }, 16);

    return () => {
      clearInterval(timer);
    };
  }, [value, duration]);

  return (
    <span>
      {prefix || ''}
      {Math.floor(count).toLocaleString()}
      {suffix || ''}
    </span>
  );
}

export function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-12 md:py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {isInView ? (
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

