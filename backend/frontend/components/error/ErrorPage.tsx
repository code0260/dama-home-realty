'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
  statusCode?: number;
  title?: string;
  description?: string;
}

export function ErrorPage({ 
  error, 
  reset, 
  statusCode = 500,
  title,
  description 
}: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console or error reporting service
    if (error) {
      console.error('Error page error:', error);
    }
  }, [error]);

  const errorMessages: Record<number, { title: string; description: string }> = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist or has been moved.',
    },
    500: {
      title: 'Internal Server Error',
      description: 'Something went wrong on our end. Please try again later.',
    },
    403: {
      title: 'Access Forbidden',
      description: 'You do not have permission to access this resource.',
    },
    401: {
      title: 'Unauthorized',
      description: 'Please log in to access this page.',
    },
  };

  const errorInfo = errorMessages[statusCode] || {
    title: title || 'An Error Occurred',
    description: description || error?.message || 'Something went wrong. Please try again.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Error Code */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-9xl font-bold text-[#B49162] mb-4"
        >
          {statusCode}
        </motion.div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
          {errorInfo.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {errorInfo.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <Button
              onClick={reset}
              className="bg-[#0F172A] hover:bg-[#0F172A]/90 text-white px-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-[#B49162] text-[#B49162] hover:bg-[#B49162] hover:text-white px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-[#B49162] text-[#B49162] hover:bg-[#B49162] hover:text-white px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

