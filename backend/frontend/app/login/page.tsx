'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui-custom/Logo';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import { TwoFactorAuth } from '@/components/auth/TwoFactorAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState<string | null>(null);

  // Redirect if already authenticated (only once) - but only if not currently logging in
  const hasRedirectedRef = useRef(false);
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasRedirectedRef.current && !isLoading) {
      hasRedirectedRef.current = true;
      const redirectTo = searchParams.get('redirect') || '/portal';
      // Use window.location to ensure full page reload
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, authLoading, router, searchParams, isLoading]);

  // Store redirect URL if coming from booking
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      sessionStorage.setItem('redirectAfterLogin', redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password, remember);
      // Check if 2FA is required (this would come from the API response)
      // For now, we'll assume 2FA is optional
      // If the API returns a 2FA requirement, show the 2FA component
    } catch (err: any) {
      // Check if error indicates 2FA is required
      if (err.response?.status === 423 || err.response?.data?.requires_2fa) {
        setShow2FA(true);
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.errors?.email?.[0] ||
          'Invalid email or password. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (code: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // This would be a separate API call to verify 2FA code
      // await verify2FA(email, code);
      // For now, we'll just close the 2FA modal and continue
      setShow2FA(false);
      // The login should continue after 2FA verification
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoginLoading(provider);
    try {
      // Redirect to OAuth provider
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
      window.location.href = `${baseUrl}/auth/${provider}/redirect`;
    } catch (err: any) {
      setError('Failed to initiate social login. Please try again.');
      setSocialLoginLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (show2FA) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <TwoFactorAuth
            onVerify={handle2FAVerify}
            isLoading={isLoading}
            error={error}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900">
      <div className="container max-w-6xl mx-auto">
        {/* Login Form */}
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="w-full max-w-md mx-auto border-2 border-gray-200 dark:border-primary-700">
              <CardHeader className="space-y-4">
                <div className="flex justify-center">
                  <Logo size="lg" showText={false} />
                </div>
                <div className="space-y-1 text-center">
                  <CardTitle className="text-3xl font-bold text-primary dark:text-white">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to your account to continue
                  </CardDescription>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Social Login */}
                  <SocialLogin
                    onSocialLogin={handleSocialLogin}
                    isLoading={!!socialLoginLoading}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(checked) => setRemember(checked === true)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <ForgotPassword />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/90 text-white h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="text-secondary hover:underline font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

