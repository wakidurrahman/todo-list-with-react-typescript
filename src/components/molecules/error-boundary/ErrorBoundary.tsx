/**
 * ErrorBoundary Component
 *
 * A functional component that catches JavaScript errors anywhere in their child
 * component tree, logs those errors, and displays a fallback UI.
 */

import { useEffect, useState } from 'react';

import ErrorFallback from '@/components/molecules/error-fallback/ErrorFallback';
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/error.types';

const ErrorBoundary = ({ children, fallback }: ErrorBoundaryProps) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
  });

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by ErrorBoundary:', error);
      setErrorState({ hasError: true, error: error.error });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleReset = (): void => {
    setErrorState({ hasError: false });
  };

  if (errorState.hasError && errorState.error) {
    return (
      fallback || (
        <ErrorFallback
          error={errorState.error}
          resetErrorBoundary={handleReset}
        />
      )
    );
  }

  return children;
};

export default ErrorBoundary;
