'use client';

import { motion } from 'framer-motion';
import { Calendar, Target, Users, Award } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Dama Home Realty was founded with a vision to connect Syrian expats with their homeland through trusted real estate services.',
    icon: Calendar,
  },
  {
    year: '2021',
    title: 'Expanding Services',
    description: 'We expanded our services to include property management, legal assistance, and comprehensive support for expats.',
    icon: Target,
  },
  {
    year: '2022',
    title: 'Growing Team',
    description: 'Our team of local experts grew, bringing unparalleled knowledge of Damascus real estate market.',
    icon: Users,
  },
  {
    year: '2023',
    title: 'Recognition',
    description: 'We became the trusted platform for Syrian expats worldwide, with hundreds of successful transactions.',
    icon: Award,
  },
];

export function Timeline() {
  return (
    <div className="relative py-16">
      {/* Timeline Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#B49162] via-[#B49162]/50 to-[#B49162] transform md:-translate-x-1/2" />

      <div className="relative space-y-12">
        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-center md:text-left`}>
                <div className={`inline-block ${isEven ? 'md:ml-auto' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-[#B49162]">{event.year}</span>
                    <div className="p-2 bg-[#B49162]/10 rounded-full">
                      <Icon className="w-6 h-6 text-[#B49162]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{event.title}</h3>
                  <p className="text-gray-600 max-w-md">{event.description}</p>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <div className="w-3 h-3 bg-[#B49162] rounded-full" />
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

