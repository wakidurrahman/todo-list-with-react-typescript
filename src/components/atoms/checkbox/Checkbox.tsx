// src/components/atoms/checkbox/Checkbox.tsx
import React from 'react';

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  id: string;
  ariaLabel?: string;
  value?: string;
  children?: React.ReactNode;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  ariaLabel,
  value,
  children,
}) => (
  <div className="form-check">
    <input
      className="form-check-input mt-2"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id={id}
      aria-label={ariaLabel}
      value={value}
    />
    <label
      className={`form-check-label w-100 ${checked ? 'text-decoration-line-through' : ''}`}
      htmlFor={id}
    >
      {children}
    </label>
  </div>
);

export default Checkbox;
