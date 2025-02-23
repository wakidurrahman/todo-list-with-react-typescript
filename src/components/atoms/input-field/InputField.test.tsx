import { fireEvent, render, screen } from '@testing-library/react';

import InputField from './InputField';

describe('InputField', () => {
  const defaultProps = {
    id: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with basic props', () => {
    render(<InputField {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    const label = 'Test Label';
    render(<InputField {...defaultProps} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('shows required asterisk when required prop is true', () => {
    render(<InputField {...defaultProps} label="Test Label" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays help text when provided', () => {
    const helpText = 'This is help text';
    render(<InputField {...defaultProps} helpText={helpText} />);
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const error = 'This field is required';
    render(<InputField {...defaultProps} error={error} />);
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', () => {
    const onChange = jest.fn();
    render(<InputField {...defaultProps} onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    render(<InputField {...defaultProps} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies readonly state correctly', () => {
    render(<InputField {...defaultProps} readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
});
