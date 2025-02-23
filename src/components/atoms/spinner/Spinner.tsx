/**
 * Spinner Component
 *
 * A reusable loading spinner component that uses Bootstrap classes
 * with support for different color variants and accessibility features.
 *
 * Features:
 * - Bootstrap spinner styling
 * - Customizable color variants
 * - Size variants (sm, md, lg)
 * - Accessibility support with ARIA attributes
 * - Custom loading text
 * - Additional class name support
 *
 * @example
 * // Basic usage
 * <Spinner />
 *
 * // With custom props
 * <Spinner
 *   variant="success"
 *   size="lg"
 *   loadingText="Please wait..."
 *   className="my-3"
 * />
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
  /** Color variant for the spinner */
  variant?: SpinnerVariant;
  /** Size of the spinner - sm, md or lg */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Screen reader text for accessibility */
  loadingText?: string;
};

/**
 * Spinner component that renders a Bootstrap loading spinner with
 * configurable size, color and loading text.
 */
const Spinner = ({
  variant = 'primary',
  size = 'md',
  className = '',
  loadingText = 'Loading...',
}: SpinnerProps) => {
  // Map size prop to corresponding Bootstrap classes
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg',
  }[size];

  return (
    <div
      className={`spinner-border text-${variant} ${sizeClass} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span className="visually-hidden">{loadingText}</span>
    </div>
  );
};

export default Spinner;
