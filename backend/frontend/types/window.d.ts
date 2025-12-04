// Extend Window interface for Google Analytics
interface Window {
  gtag?: (
    command: 'event' | 'config' | 'set',
    targetId: string | 'event',
    config?: {
      event_category?: string;
      event_label?: string;
      [key: string]: unknown;
    }
  ) => void;
  __networkErrorLogged?: boolean;
}

