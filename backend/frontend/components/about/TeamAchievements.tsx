'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, TrendingUp, Award, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}

const achievements: Achievement[] = [
  {
    icon: Trophy,
    title: 'Top Performers',
    value: '15',
    description: 'Team members recognized for excellence',
    trend: 'up',
  },
  {
    icon: Star,
    title: 'Client Satisfaction',
    value: '98%',
    description: 'Average client satisfaction rating',
    trend: 'up',
  },
  {
    icon: Target,
    title: 'Success Rate',
    value: '95%',
    description: 'Successful property transactions',
    trend: 'up',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    value: '150%',
    description: 'Year-over-year team performance growth',
    trend: 'up',
  },
  {
    icon: Users,
    title: 'Active Clients',
    value: '750+',
    description: 'Clients served by our team',
    trend: 'up',
  },
  {
    icon: Award,
    title: 'Team Awards',
    value: '12',
    description: 'Industry awards and recognitions',
    trend: 'neutral',
  },
];

export function TeamAchievements() {
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
            <Trophy className="w-10 h-10 text-secondary" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">
              Team Achievements
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Celebrating excellence and outstanding performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-primary-700 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-secondary/10 rounded-full">
                        <Icon className="w-6 h-6 text-secondary" />
                      </div>
                      {achievement.trend === 'up' && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Up
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-primary dark:text-white mb-1">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-secondary mb-2">
                      {achievement.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

