'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Medal, Calendar } from 'lucide-react';

interface AwardItem {
  year: string;
  title: string;
  issuer: string;
  description: string;
  icon: React.ReactNode;
}

const awards: AwardItem[] = [
  {
    year: '2023',
    title: 'Excellence in Real Estate Services',
    issuer: 'Damascus Real Estate Association',
    description: 'Recognized for outstanding service quality and client satisfaction',
    icon: <Trophy className="w-8 h-8" />,
  },
  {
    year: '2022',
    title: 'Best Digital Platform',
    issuer: 'Syrian Tech Awards',
    description: 'Awarded for innovation in real estate technology and user experience',
    icon: <Star className="w-8 h-8" />,
  },
  {
    year: '2021',
    title: 'Community Impact Award',
    issuer: 'Syrian Diaspora Foundation',
    description: 'Recognized for positive impact on the Syrian expat community',
    icon: <Medal className="w-8 h-8" />,
  },
];

export function AwardsRecognition() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-primary-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-10 h-10 text-secondary" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">
              Awards & Recognition
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recognition for our commitment to excellence and community service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-4 bg-secondary/10 rounded-full text-secondary flex-shrink-0">
                      {award.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {award.year}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-primary dark:text-white mb-1">
                        {award.title}
                      </h3>
                      <p className="text-sm text-secondary font-semibold mb-2">
                        {award.issuer}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {award.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

