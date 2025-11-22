'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Briefcase, Award } from 'lucide-react';
import { Agent } from '@/types';
import { cn } from '@/lib/utils';

interface TeamHierarchyProps {
  agents: Agent[];
  className?: string;
}

const getRoleLevel = (role: string | null | undefined): { level: number; label: string; icon: React.ReactNode; color: string } => {
  if (!role) return { level: 3, label: 'Agent', icon: <Users className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  
  const roleLower = role.toLowerCase();
  if (roleLower.includes('director') || roleLower.includes('manager') || roleLower.includes('lead')) {
    return { level: 1, label: 'Leadership', icon: <Crown className="w-5 h-5" />, color: 'bg-secondary text-white' };
  }
  if (roleLower.includes('senior') || roleLower.includes('expert')) {
    return { level: 2, label: 'Senior', icon: <Award className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
  }
  return { level: 3, label: 'Agent', icon: <Briefcase className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
};

export function TeamHierarchy({ agents, className }: TeamHierarchyProps) {
  // Group agents by role level
  const groupedAgents = agents.reduce((acc, agent) => {
    const roleInfo = getRoleLevel(agent.role);
    if (!acc[roleInfo.level]) {
      acc[roleInfo.level] = {
        ...roleInfo,
        agents: [],
      };
    }
    acc[roleInfo.level].agents.push(agent);
    return acc;
  }, {} as Record<number, { level: number; label: string; icon: React.ReactNode; color: string; agents: Agent[] }>);

  const sortedLevels = Object.keys(groupedAgents)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <section className={cn('py-20 md:py-32 bg-background', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-10 h-10 text-secondary" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">
              Team Structure
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our organized team structure ensures expert guidance at every level
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {sortedLevels.map((level, levelIndex) => {
            const levelData = groupedAgents[level];
            if (!levelData || levelData.agents.length === 0) return null;

            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: levelIndex * 0.1 }}
              >
                <Card className="border-2 border-gray-200 dark:border-primary-700 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Level Header */}
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-primary-700">
                      <div className={cn('p-3 rounded-full', levelData.color)}>
                        {levelData.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary dark:text-white">
                          {levelData.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {levelData.agents.length} {levelData.agents.length === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {levelData.agents.map((agent, agentIndex) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: agentIndex * 0.05 }}
                          className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg hover:bg-gray-100 dark:hover:bg-primary-700 transition-colors duration-200"
                        >
                          <h4 className="font-semibold text-primary dark:text-white mb-1">
                            {agent.name}
                          </h4>
                          {agent.role && (
                            <p className="text-sm text-secondary mb-1">{agent.role}</p>
                          )}
                          {agent.languages && agent.languages.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {agent.languages.slice(0, 2).map((lang, langIndex) => (
                                <Badge key={langIndex} variant="outline" className="text-xs">
                                  {lang}
                                </Badge>
                              ))}
                              {agent.languages.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{agent.languages.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
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


