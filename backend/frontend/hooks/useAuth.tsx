'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isCheckingRef = useRef(false);
  const hasCheckedRef = useRef(false);

  // Check if user is authenticated on mount only
  useEffect(() => {
    // Only check once on mount
    if (!hasCheckedRef.current) {
      checkAuth();
    }
  }, []); // Empty dependency array - only run once on mount

  const checkAuth = async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    hasCheckedRef.current = true;

    try {
      // Laravel Sanctum SPA uses session cookies, not localStorage tokens
      // Just try to get current user - if it fails, user is not authenticated
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      // If auth fails, user is not authenticated
      // Don't log network/timeout errors for auth check (it's expected if backend is down)
      if (error.isNetworkError || error.isTimeoutError) {
        // Silently fail - user is just not authenticated
        setUser(null);
      } else {
        // Log other errors
        console.warn('Auth check failed:', error.message || error);
        setUser(null);
      }
    } finally {
      setLoading(false);
      isCheckingRef.current = false;
    }
  };

  // Expose refreshAuth for manual refresh when needed
  const refreshAuth = async () => {
    // Reset checking flag to allow refresh
    isCheckingRef.current = false;
    hasCheckedRef.current = false;
    await checkAuth();
  };

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      const response = await apiLogin({ email, password, remember });
      // Set user state first
      setUser(response.user);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh auth to ensure isAuthenticated is updated
      await refreshAuth();
      
      // Redirect to portal or back to previous page
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/portal';
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Use window.location for full page reload to ensure auth state is properly set
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await apiRegister({ name, email, password, password_confirmation });
      // Set user state first
      setUser(response.user);
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh auth to ensure isAuthenticated is updated
      await refreshAuth();
      
      // Use window.location for full page reload to ensure auth state is properly set
      if (typeof window !== 'undefined') {
        window.location.href = '/portal';
      } else {
        router.push('/portal');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      router.push('/');
    } catch (error: any) {
      // Even if logout fails, clear local state
      setUser(null);
      router.push('/');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
