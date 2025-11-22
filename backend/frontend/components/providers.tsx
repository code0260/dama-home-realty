'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Analytics } from '@/components/analytics/Analytics';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';

export function Providers({ children }: { children: ReactNode }) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <PerformanceProvider>
            {children}
            {googleAnalyticsId && <Analytics googleAnalyticsId={googleAnalyticsId} />}
          </PerformanceProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

