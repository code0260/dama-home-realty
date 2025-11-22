'use client';

import { usePullToRefresh } from '@/hooks/useSwipe';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  enabled?: boolean;
  className?: string;
}

/**
 * Pull-to-refresh component for mobile
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  enabled = true,
  className,
}: PullToRefreshProps) {
  const { isRefreshing, pullDistance, pullProgress } = usePullToRefresh(
    onRefresh,
    { threshold, enabled }
  );

  return (
    <div className={cn('relative', className)}>
      {/* Pull indicator */}
      {enabled && pullDistance > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-20 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: pullProgress,
              scale: pullProgress,
            }}
            className="flex flex-col items-center gap-2"
          >
            <RefreshCw
              className={cn(
                'w-6 h-6 text-secondary',
                isRefreshing && 'animate-spin'
              )}
              style={{
                transform: `rotate(${pullDistance * 2}deg)`,
              }}
            />
            <span className="text-sm font-medium text-secondary">
              {pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className={cn(isRefreshing && 'opacity-50 pointer-events-none')}>
        {children}
      </div>
    </div>
  );
}

