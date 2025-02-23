import React from 'react';

type SelectSize = 'sm' | 'lg' | undefined;

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  /** Options for the select */
  options: SelectOption[];
  /** Selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Select label */
  label?: string;
  /** Select id - required for accessibility */
  id: string;
  /** Select size - sm or lg */
  size?: SelectSize;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Help text below the select */
  helpText?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Select name attribute */
  name?: string;
  /** Error message */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Aria-label for accessibility */
  'aria-label'?: string;
  /** Whether multiple options can be selected */
  multiple?: boolean;
  /** Size attribute for showing multiple options */
  visibleOptions?: number;
  /** Default option text */
  defaultOption?: string;
};

const SelectField = ({
  options,
  value,
  onChange,
  label,
  id,
  size,
  disabled = false,
  helpText,
  required = false,
  name,
  error,
  className = '',
  'aria-label': ariaLabel,
  multiple = false,
  visibleOptions,
  defaultOption = 'Select an option',
}: SelectFieldProps) => {
  // Generate unique IDs for help text and error message
  const helpTextId = `${id}-help-text`;
  const errorId = `${id}-error`;

  // Combine aria-describedby values
  const ariaDescribedbyValues = [
    helpText ? helpTextId : '',
    error ? errorId : '',
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
      <select
        className={`form-select ${size ? `form-select-${size}` : ''} ${
          error ? 'is-invalid' : ''
        } ${className}`.trim()}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedbyValues || undefined}
        multiple={multiple}
        size={visibleOptions}
      >
        {!multiple && (
          <option value="" disabled>
            {defaultOption}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {/* Help text */}
      {helpText && (
        <div id={helpTextId} className="form-text">
          {helpText}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div id={errorId} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
};

export default SelectField;
