/**
 * Alert Component
 *
 * A reusable alert component that uses Bootstrap classes for styling
 * and includes accessibility features.
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

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    setIsVisible(show);

    if (timeout && show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout, show, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`alert alert-${variant} ${
        dismissible ? 'alert-dismissible fade show' : ''
      }`}
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
