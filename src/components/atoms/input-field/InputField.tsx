import { ChangeEvent } from 'react';

type InputSize = 'sm' | 'lg' | undefined;

type InputFieldProps = {
  tagName?: 'input' | 'textarea';
  /** Input id - required for accessibility */
  id: string;
  /** Input label */
  label?: string;
  /** Input type (text, email, password, etc.) */
  type?: 'text' | 'email' | 'password' | 'number';
  /** Input value */
  value: string;
  /** Callback when input value changes */
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Input name attribute */
  name?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Input size - sm or lg */
  size?: InputSize;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readOnly?: boolean;
  /** Help text below the input */
  helpText?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Aria-describedby for accessibility */
  'aria-describedby'?: string;
  /** Whether the input has been touched */
  touched?: boolean;
  /** Maximum length of the input */
  maxLength?: number;
  /** Whether the input is valid */
  isValid?: boolean;
  /** Feedback message for valid input */
  validFeedback?: string;
  /** Aria-label for accessibility */
  'aria-label'?: string;
  /** Whether the input is tabbable */
  tabIndex?: number;
  /** Number of rows for textarea */
  rows?: number;
};

const InputField = ({
  tagName = 'input',
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  id,
  size,
  disabled = false,
  readOnly = false,
  helpText,
  required = false,
  name,
  error,
  className = '',
  touched = false,
  maxLength,
  isValid,
  validFeedback = 'Looks good!',
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
  tabIndex = 0,
  rows = 3,
}: InputFieldProps) => {
  // Tag name
  const Tag = tagName === 'input' ? 'input' : 'textarea';
  // Generate unique IDs for help text and error message
  const helpTextId = `${id}-help-text`;
  const errorId = `${id}-error`;
  const feedbackId = `${id}-field`;

  // Combine aria-describedby values
  const ariaDescribedbyValues = [
    helpText ? helpTextId : '',
    error ? errorId : '',
    ariaDescribedby || '',
    touched ? feedbackId : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <Tag
        type={type}
        className={`form-control ${size ? `form-control-${size}` : ''} ${
          touched ? (error ? 'is-invalid' : isValid ? 'is-valid' : '') : ''
        } ${className}`.trim()}
        id={id}
        name={name || id}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e)
        }
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        aria-describedby={ariaDescribedbyValues || undefined}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        rows={rows}
      />

      {/* Help text */}
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}

      {/* Error message */}
      {touched && error && (
        <div id={errorId} className="invalid-feedback">
          {error}
        </div>
      )}

      {/* Valid feedback */}
      {touched && !error && isValid && (
        <div id={feedbackId} className="valid-feedback">
          {validFeedback}
        </div>
      )}
    </div>
  );
};

export default InputField;
