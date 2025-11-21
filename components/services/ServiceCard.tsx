'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Briefcase, Scale, Car, Home, Wrench, FileText, Building2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onRequest: (service: Service) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'heroicon-o-briefcase': Briefcase,
  'heroicon-o-scale': Scale,
  'heroicon-o-car': Car,
  'heroicon-o-home': Home,
  'heroicon-o-wrench': Wrench,
  'heroicon-o-file-text': FileText,
  'heroicon-o-building': Building2,
};

export function ServiceCard({ service, onRequest }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const IconComponent = service.icon && iconMap[service.icon] 
    ? iconMap[service.icon] 
    : Briefcase;

  return (
    <motion.div
      className="relative w-full h-[300px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Container */}
      <motion.div
        className="relative w-full h-full bg-[#0F172A] rounded-2xl overflow-hidden shadow-xl"
        animate={{
          height: isHovered ? 'auto' : '300px',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Default State: Icon + Title (Minimalist) */}
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="default"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <motion.div
                className="p-6 bg-[#B49162]/20 rounded-full mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent className="w-16 h-16 text-[#B49162]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white text-center">
                {service.title}
              </h3>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col p-8 justify-between"
            >
              {/* Icon at top */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-4 bg-[#B49162]/20 rounded-full">
                  <IconComponent className="w-12 h-12 text-[#B49162]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-gray-300 leading-relaxed line-clamp-4">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Request Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequest(service);
                  }}
                  className="w-full bg-[#B49162] hover:bg-[#9A7A4F] text-white shadow-lg"
                  size="lg"
                >
                  Request Service
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </motion.div>
  );
}

