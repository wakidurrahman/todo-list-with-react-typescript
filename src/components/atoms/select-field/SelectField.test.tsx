import { fireEvent, render, screen } from '@testing-library/react';

import SelectField from './SelectField';

describe('SelectField', () => {
  const defaultProps = {
    id: 'test-select',
    value: '',
    onChange: jest.fn(),
    options: [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ],
  };

  it('renders correctly with basic props', () => {
    render(<SelectField {...defaultProps} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<SelectField {...defaultProps} />);
    defaultProps.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('renders label when provided', () => {
    const label = 'Test Label';
    render(<SelectField {...defaultProps} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('shows required asterisk when required prop is true', () => {
    render(<SelectField {...defaultProps} label="Test Label" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays help text when provided', () => {
    const helpText = 'This is help text';
    render(<SelectField {...defaultProps} helpText={helpText} />);
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const error = 'This field is required';
    render(<SelectField {...defaultProps} error={error} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('calls onChange handler when selection changes', () => {
    const onChange = jest.fn();
    render(<SelectField {...defaultProps} onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '1' },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    render(<SelectField {...defaultProps} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders in multiple select mode when specified', () => {
    render(<SelectField {...defaultProps} multiple />);
    expect(screen.getByRole('listbox')).toHaveAttribute('multiple');
  });

  it('applies size attribute when visibleOptions is specified', () => {
    const visibleOptions = 3;
    render(<SelectField {...defaultProps} visibleOptions={visibleOptions} />);
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'size',
      String(visibleOptions)
    );
  });
});
