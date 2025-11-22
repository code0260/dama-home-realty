'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  History,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Version {
  version: string;
  date: string;
  changes: string[];
  isCurrent?: boolean;
}

interface VersionHistoryProps {
  versions: Version[];
  className?: string;
}

export function VersionHistory({ versions, className }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
            <History className="w-5 h-5 text-secondary" />
            Version History
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div
                      key={version.version}
                      className={cn(
                        'border-l-2 pl-4 pb-4',
                        version.isCurrent
                          ? 'border-secondary'
                          : 'border-gray-200 dark:border-primary-700'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-primary dark:text-white">
                            Version {version.version}
                          </span>
                          {version.isCurrent && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(version.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {version.changes.map((change, changeIndex) => (
                          <li key={changeIndex} className="flex items-start gap-2">
                            <span className="text-secondary mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                      {index < versions.length - 1 && (
                        <div className="h-px bg-gray-200 dark:bg-primary-700 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

