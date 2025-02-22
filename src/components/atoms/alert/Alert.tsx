/**
 * Alert Component
 *
 * A reusable alert component that uses Bootstrap classes for styling
 * and includes accessibility features.
 */

import { useEffect, useState } from 'react';

import Button from '@/components/atoms/button/Button';
import { AlertVariant } from '@/types/error.types';

type AlertProps = {
  dismissible?: boolean;
  message: React.ReactNode;
  show?: boolean;
  timeout?: number;
  variant?: AlertVariant;
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
  }, [show]);

  useEffect(() => {
    if (timeout && show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, timeout);
      return () => clearTimeout(timer);
    }
    return () => {}; // Add empty cleanup function for other code paths.
  }, [timeout, show, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`alert alert-${variant} ${
        dismissible ? 'alert-dismissible fade show' : ''
      }`}
      role="alert"
      aria-live="polite"
    >
      {message}
      {dismissible && (
        <Button
          variant="secondary"
          className="btn-close"
          aria-label="Close alert"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        />
      )}
    </div>
  );
};

export default Alert;
