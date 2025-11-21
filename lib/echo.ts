import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Declare Pusher on window for Laravel Echo
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

let echoInstance: Echo<any> | null = null;

export function initializeEcho(): Echo<any> | null {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance if already initialized
  if (echoInstance) {
    return echoInstance;
  }

  // Check if Pusher credentials are available
  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'mt1';

  if (!pusherKey) {
    console.warn('Pusher credentials not found. Real-time notifications disabled.');
    return null;
  }

  // Initialize Pusher
  if (!window.Pusher) {
    window.Pusher = Pusher;
  }

  // Initialize Laravel Echo
  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: pusherKey,
    cluster: pusherCluster,
    forceTLS: true,
    encrypted: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  });

  return echoInstance;
}

export function getEcho(): Echo<any> | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!echoInstance) {
    return initializeEcho();
  }

  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

