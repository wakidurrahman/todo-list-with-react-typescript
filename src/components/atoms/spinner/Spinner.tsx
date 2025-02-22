/**
 * Spinner Component
 *
 * A reusable loading spinner component that uses Bootstrap classes
 * with support for different color variants and accessibility features.
 */

type SpinnerVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

type SpinnerProps = {
  variant?: SpinnerVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loadingText?: string;
};

const Spinner = ({
  variant = 'primary',
  size = 'md',
  className = '',
  loadingText = 'Loading...',
}: SpinnerProps) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg',
  }[size];

  return (
    <div
      className={`spinner-border text-${variant} ${sizeClass} ${className}`}
      role="status"
    >
      <span className="visually-hidden">{loadingText}</span>
    </div>
  );
};

export default Spinner;
