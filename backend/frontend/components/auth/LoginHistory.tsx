'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin, Monitor, Smartphone, Tablet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

interface LoginSession {
  id: number;
  ip_address: string;
  user_agent: string;
  location?: string;
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  login_at: string;
  is_current: boolean;
}

interface LoginHistoryProps {
  className?: string;
}

export function LoginHistory({ className }: LoginHistoryProps) {
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<{ data: LoginSession[] }>('/auth/sessions');
        setSessions(response.data.data || []);
      } catch (error) {
        console.error('Error fetching login history:', error);
        // Mock data for demonstration
        setSessions([
          {
            id: 1,
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            location: 'Damascus, Syria',
            device_type: 'desktop',
            login_at: new Date().toISOString(),
            is_current: true,
          },
          {
            id: 2,
            ip_address: '192.168.1.2',
            user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
            location: 'Damascus, Syria',
            device_type: 'mobile',
            login_at: new Date(Date.now() - 3600000).toISOString(),
            is_current: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await axiosInstance.delete(`/auth/sessions/${sessionId}`);
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Login History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-secondary" />
          Login History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No login history available
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    'p-4 border rounded-lg transition-all duration-200',
                    session.is_current
                      ? 'bg-secondary/10 border-secondary'
                      : 'bg-gray-50 dark:bg-primary-800 border-gray-200 dark:border-primary-700'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        'p-2 rounded-lg',
                        session.is_current
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-gray-200 dark:bg-primary-700 text-gray-600 dark:text-gray-400'
                      )}>
                        {getDeviceIcon(session.device_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary dark:text-white capitalize">
                            {session.device_type}
                          </span>
                          {session.is_current && (
                            <Badge variant="outline" className="bg-secondary/10 border-secondary text-secondary text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{session.location || session.ip_address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {format(new Date(session.login_at), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

