'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface VideoStoryProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function VideoStory({
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video URL
  thumbnailUrl,
  title = 'Our Story in Motion',
  description = 'Watch our journey and discover what drives us',
  className,
}: VideoStoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={cn('py-20 md:py-32 bg-background relative overflow-hidden', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>

          {/* Video Thumbnail Card */}
          <Card
            className="relative group cursor-pointer overflow-hidden border-2 border-gray-200 dark:border-primary-700 hover:border-secondary transition-all duration-300"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative aspect-video bg-gray-100 dark:bg-primary-800">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Youtube className="w-24 h-24 text-secondary/50" />
                </div>
              )}

              {/* Play Button Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 md:w-24 md:h-24 bg-secondary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="currentColor" />
                </motion.div>
              </motion.div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                  Watch Our Story
                </h3>
                <p className="text-white/80 text-sm">
                  Click to play video
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black border-none">
          <div className="relative aspect-video">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <iframe
              src={isOpen ? `${videoUrl}?autoplay=1` : ''}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

