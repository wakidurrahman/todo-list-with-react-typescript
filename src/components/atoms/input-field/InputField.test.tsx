import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import InputField from './InputField';

/**
 * Test suite for the InputField component
 *
 * Categories:
 * - Basic Rendering
 *   - Default input rendering
 *   - Textarea variant
 *   - Label rendering
 *   - Required field indicator
 *
 * - Input Behavior
 *   - Value changes
 *   - Disabled state
 *   - Readonly state
 *   - MaxLength validation
 *
 * - Validation and Feedback
 *   - Error messages
 *   - Valid feedback
 *   - Help text
 *   - Validation classes
 *
 * - Accessibility
 *   - ARIA attributes
 *   - Help text association
 *   - Tab index
 *   - Label associations
 *
 * - Styling
 *   - Size variants
 *   - Custom classes
 *
 * - Snapshots
 *   - Basic input
 *   - Textarea variant
 *   - Input with validation
 */
describe('InputField Component', () => {
  const defaultProps = {
    id: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders input field with default props', () => {
      render(<InputField {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders textarea when tagName is textarea', () => {
      render(<InputField {...defaultProps} tagName="textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.tagName.toLowerCase()).toBe('textarea');
    });

    it('renders label when provided', () => {
      const label = 'Test Label';
      render(<InputField {...defaultProps} label={label} />);
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it('shows required asterisk when required prop is true', () => {
      render(<InputField {...defaultProps} label="Test Label" required />);
      expect(screen.getByText('*')).toHaveClass('text-danger');
    });
  });

  // Input behavior tests
  describe('Input Behavior', () => {
    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<InputField {...defaultProps} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', () => {
      render(<InputField {...defaultProps} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('respects readonly state', () => {
      render(<InputField {...defaultProps} readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('applies maxLength constraint', () => {
      const maxLength = 10;
      render(<InputField {...defaultProps} maxLength={maxLength} />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'maxLength',
        maxLength.toString()
      );
    });
  });

  // Validation and feedback tests
  describe('Validation and Feedback', () => {
    it('shows error message when touched and has error', () => {
      const errorMessage = 'This field is required';
      render(
        <InputField {...defaultProps} touched={true} error={errorMessage} />
      );
      expect(screen.getByText(errorMessage)).toHaveClass('invalid-feedback');
    });

    it('shows valid feedback when touched and valid', () => {
      const validMessage = 'Looks good!';
      render(
        <InputField
          {...defaultProps}
          touched
          isValid
          validFeedback={validMessage}
        />
      );
      expect(screen.getByText(validMessage)).toHaveClass('valid-feedback');
    });

    it('shows help text when provided', () => {
      const helpText = 'Enter your username';
      render(<InputField {...defaultProps} helpText={helpText} />);
      expect(screen.getByText(helpText)).toHaveClass('form-text');
    });

    it('applies validation classes correctly', () => {
      render(<InputField {...defaultProps} touched error="Error" />);
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('associates help text with input via aria-describedby', () => {
      const helpText = 'Help text';
      render(<InputField {...defaultProps} helpText={helpText} />);

      const input = screen.getByRole('textbox');
      const helpTextElement = screen.getByText(helpText);

      expect(input).toHaveAttribute('aria-describedby', helpTextElement.id);
    });

    it('applies custom aria-label', () => {
      const ariaLabel = 'Custom label';
      render(<InputField {...defaultProps} aria-label={ariaLabel} />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-label',
        ariaLabel
      );
    });

    it('sets correct tabIndex', () => {
      const tabIndex = 2;
      render(<InputField {...defaultProps} tabIndex={tabIndex} />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'tabindex',
        tabIndex.toString()
      );
    });
  });

  // Style tests
  describe('Styling', () => {
    it('applies size classes correctly', () => {
      render(<InputField {...defaultProps} size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('form-control-lg');
    });

    it('applies custom className', () => {
      const customClass = 'custom-input';
      render(<InputField {...defaultProps} className={customClass} />);
      expect(screen.getByRole('textbox')).toHaveClass(customClass);
    });
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches basic input snapshot', () => {
      const tree = renderer
        .create(<InputField {...defaultProps} label="Basic Input" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches textarea snapshot', () => {
      const tree = renderer
        .create(
          <InputField
            {...defaultProps}
            tagName="textarea"
            label="Textarea Input"
            rows={4}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches input with validation snapshot', () => {
      const tree = renderer
        .create(
          <InputField
            {...defaultProps}
            label="Validated Input"
            touched
            error="Error message"
            helpText="Help text"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
