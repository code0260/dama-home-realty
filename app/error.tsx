'use client';

import { ErrorPage } from '@/components/error/ErrorPage';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return <ErrorPage error={error} reset={reset} statusCode={500} />;
}

