/**
 * Alert Component
 *
 * A reusable alert component that uses Bootstrap classes for styling
 * and includes accessibility features.
 *
 * Performance Optimizations:
 *
 * 1. useCallback for handleClose:
 * - Memoizes the close handler function to maintain referential equality between renders
 * - Prevents unnecessary re-renders of child components that receive this as a prop
 * - Only recreates if onClose prop changes
 * - Important since this is passed to Button component and used in useEffect
 *
 * 2. useMemo for alertClassName:
 * - Memoizes the computed className string to avoid recalculating on every render
 * - Only recomputes when variant or dismissible props change
 * - While string concatenation is not expensive, memoization helps when component re-renders frequently
 * - Follows best practice of caching computed values used in render
 *
 * 3. useState for isVisible:
 * - Manages internal visibility state separate from props
 * - Allows for smooth transitions and animations
 * - Enables controlled dismissal behavior
 *
 * 4. useEffect for timeout:
 * - Handles auto-dismiss functionality
 * - Properly cleans up timeout to prevent memory leaks
 * - Only runs when relevant dependencies change
 *
 * @component
 * @example
 * ```tsx
 * <Alert
 *   message="Success!"
 *   variant="success"
 *   dismissible={true}
 *   timeout={3000}
 *   onClose={() => console.log('Alert closed')}
 * />
 * ```
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import Button from '@/components/atoms/button/Button';
import { AlertVariant } from '@/types/error.types';

type AlertProps = {
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Content to display in the alert */
  message: React.ReactNode;
  /** Whether the alert is visible */
  show?: boolean;
  /** Auto-dismiss timeout in milliseconds */
  timeout?: number;
  /** Bootstrap alert variant */
  variant?: AlertVariant;
  /** Callback when alert is closed */
  onClose?: () => void;
};

const Alert = ({
  dismissible = true,
  message,
  show = true,
  timeout,
  variant = 'info',
  onClose,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(show);

  // Memoize handleClose to prevent recreation on each render
  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    setIsVisible(show);

    if (timeout && show) {
      const timer = setTimeout(handleClose, timeout);
      return () => clearTimeout(timer);
    }
    return () => {}; // Add empty cleanup function for consistent return
  }, [timeout, show, handleClose]);

  const alertClassName = useMemo(
    () =>
      `alert alert-${variant} ${
        dismissible ? 'alert-dismissible fade show' : ''
      }`,
    [variant, dismissible]
  );

  // Early return for hidden alert
  if (!isVisible) return null;

  return (
    <div
      className={alertClassName}
      role="alert"
      aria-live="polite"
      data-testid="alert"
    >
      {message}
      {dismissible && (
        <Button
          variant="secondary"
          className="btn-close"
          aria-label="Close alert"
          onClick={handleClose}
          data-testid="alert-close-button"
        />
      )}
    </div>
  );
};

export default Alert;
