'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Analytics } from '@/components/analytics/Analytics';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

export function Providers({ children }: { children: ReactNode }) {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
          {googleAnalyticsId && <Analytics googleAnalyticsId={googleAnalyticsId} />}
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

