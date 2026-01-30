import { useEffect, useRef, useState, useCallback } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

interface UseWebSocketOptions {
  channel: string;
  events: string[];
  onEvent?: (event: string, data: any) => void;
  enabled?: boolean;
}

interface WebSocketState {
  connected: boolean;
  error: string | null;
}

export function useWebSocket({
  channel: channelName,
  events,
  onEvent,
  enabled = true,
}: UseWebSocketOptions) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    error: null,
  });
  const echoRef = useRef<Echo<any> | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initialize Pusher
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';

    if (!pusherKey) {
      setState({
        connected: false,
        error: 'Pusher key not configured',
      });
      return;
    }

    // Initialize Echo
    if (typeof window !== 'undefined' && !echoRef.current) {
      window.Pusher = Pusher;

      echoRef.current = new Echo({
        broadcaster: 'pusher',
        key: pusherKey,
        cluster: pusherCluster,
        encrypted: true,
        forceTLS: true,
        authEndpoint: '/broadcasting/auth',
        auth: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        },
      });

      // Listen for connection state
      echoRef.current.connector.pusher.connection.bind('connected', () => {
        setState({
          connected: true,
          error: null,
        });
      });

      echoRef.current.connector.pusher.connection.bind('disconnected', () => {
        setState({
          connected: false,
          error: 'Disconnected',
        });
      });

      echoRef.current.connector.pusher.connection.bind('error', (error: any) => {
        setState({
          connected: false,
          error: error?.error?.message || 'Connection error',
        });
      });
    }

    // Subscribe to channel
    if (echoRef.current && !channelRef.current) {
      const channel = echoRef.current.private(channelName);
      channelRef.current = channel;

      // Listen to events
      events.forEach((eventName) => {
        channel.listen(`.${eventName}`, (data: any) => {
          if (onEvent) {
            onEvent(eventName, data);
          }
        });
      });
    }

    // Cleanup
    return () => {
      if (channelRef.current) {
        events.forEach((eventName) => {
          channelRef.current.stopListening(`.${eventName}`);
        });
        channelRef.current = null;
      }
    };
  }, [channelName, events, onEvent, enabled]);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      events.forEach((eventName) => {
        channelRef.current.stopListening(`.${eventName}`);
      });
      channelRef.current = null;
    }

    if (echoRef.current) {
      echoRef.current.disconnect();
      echoRef.current = null;
    }

    setState({
      connected: false,
      error: null,
    });
  }, [events]);

  return {
    ...state,
    disconnect,
  };
}

