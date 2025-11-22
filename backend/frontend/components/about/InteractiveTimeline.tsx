'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Award, Target, TrendingUp, Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  milestone?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    year: '2019',
    title: 'Foundation',
    description: 'Dama Home Realty was founded with a vision to connect Syrian expats with their homeland through trusted real estate services.',
    icon: <Heart className="w-6 h-6" />,
    milestone: true,
  },
  {
    id: 2,
    year: '2020',
    title: 'First 100 Properties',
    description: 'Reached our first milestone of 100 verified properties across Damascus, establishing trust with our community.',
    icon: <Target className="w-6 h-6" />,
    milestone: false,
  },
  {
    id: 3,
    year: '2021',
    title: 'Digital Platform Launch',
    description: 'Launched our comprehensive digital platform, making property search and booking accessible from anywhere in the world.',
    icon: <TrendingUp className="w-6 h-6" />,
    milestone: true,
  },
  {
    id: 4,
    year: '2022',
    title: '500+ Happy Clients',
    description: 'Served over 500 Syrian families, helping them find their perfect homes and reconnect with their roots.',
    icon: <Users className="w-6 h-6" />,
    milestone: false,
  },
  {
    id: 5,
    year: '2023',
    title: 'Award Recognition',
    description: 'Received recognition for excellence in real estate services, further establishing our commitment to quality.',
    icon: <Award className="w-6 h-6" />,
    milestone: true,
  },
  {
    id: 6,
    year: '2024',
    title: 'Expanding Services',
    description: 'Launched additional services including property management, legal assistance, and concierge services.',
    icon: <MapPin className="w-6 h-6" />,
    milestone: false,
  },
];

export function InteractiveTimeline() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Create progress transform for timeline line
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A timeline of milestones and achievements that define our story
          </p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-primary-700 transform md:-translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 w-full bg-secondary origin-top"
              style={{ height: `${lineProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Timeline Events */}
          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0;
              const ref = useRef<HTMLDivElement>(null);
              const eventInView = useInView(ref, { once: true, margin: '-100px' });

              return (
                <motion.div
                  key={event.id}
                  ref={ref}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={eventInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn(
                    'relative flex items-center gap-8',
                    'md:flex-row',
                    isEven ? 'md:flex-row-reverse' : ''
                  )}
                  onMouseEnter={() => setActiveEvent(event.id)}
                  onMouseLeave={() => setActiveEvent(null)}
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300',
                        event.milestone
                          ? 'bg-secondary border-secondary text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-primary-800 border-secondary/30 text-secondary'
                      )}
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.3 }}
                    >
                      {event.icon || <Calendar className="w-6 h-6" />}
                    </motion.div>
                    {event.milestone && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-secondary/20 blur-xl"
                        animate={{
                          scale: activeEvent === event.id ? [1, 1.5, 1] : 1,
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Event Content Card */}
                  <motion.div
                    className={cn(
                      'flex-1',
                      isEven ? 'md:text-right' : 'md:text-left'
                    )}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={cn(
                        'border transition-all duration-300',
                        activeEvent === event.id
                          ? 'border-secondary shadow-xl bg-secondary/5'
                          : 'border-gray-200 dark:border-primary-700 hover:shadow-lg'
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3 md:flex-row-reverse md:justify-end">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-sm font-semibold',
                              event.milestone && 'border-secondary text-secondary'
                            )}
                          >
                            {event.year}
                          </Badge>
                          {event.milestone && (
                            <Badge className="bg-secondary text-white text-xs">
                              Milestone
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

