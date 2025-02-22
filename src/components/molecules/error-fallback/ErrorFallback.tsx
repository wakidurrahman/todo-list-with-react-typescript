/**
 * ErrorFallback Component
 *
 * A component that displays when an error occurs in the application.
 * It shows the error message and provides a way to recover.
 */

import Alert from '@/components/atoms/alert/Alert';
import { ErrorFallbackProps } from '@/types/error.types';

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <Alert
            variant="danger"
            message={
              <>
                <h4 className="alert-heading">Something went wrong!</h4>
                <p className="mb-0">
                  {error.message || 'An unexpected error occurred.'}
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <pre className="mt-3 mb-0 text-break">{error.stack}</pre>
                )}
              </>
            }
            dismissible={false}
          />
          <div className="text-center mt-3">
            <button
              className="btn btn-primary"
              onClick={resetErrorBoundary}
              aria-label="Try again"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
