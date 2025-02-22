/**
 * Type definitions for error handling system
 */

export type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type ErrorState = {
  message: string;
  variant: AlertVariant;
  show: boolean;
  timeout?: number;
};

export type ErrorAction = {
  type: 'SET_ERROR' | 'CLEAR_ERROR';
  payload?: ErrorState;
};

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};
