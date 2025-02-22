/**
 * A reusable Button component that follows Bootstrap styling conventions.
 * Supports different variants, sizes, and states while maintaining accessibility.
 */

type ButtonProps = {
  /** Function to be called when the button is clicked */
  onClick?: () => void;
  /** Variant of the button, defaults to 'primary' */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Size of the button, defaults to 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Content of the button */
  children?: React.ReactNode;
  /** Type of the button, defaults to 'button' */
  type?: 'button' | 'submit';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes to apply to the button */
  className?: string;
};

function Button({
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) {
  // Combine base classes with additional classes
  const baseClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
