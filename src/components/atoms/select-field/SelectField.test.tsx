import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import SelectField from './SelectField';

/**
 * Test suite for the SelectField component
 *
 * Categories:
 * - Basic Rendering
 *   - Default select rendering
 *   - Options rendering
 *   - Label rendering
 *   - Default option
 *
 * - Select Behavior
 *   - Value selection
 *   - Multiple selection
 *   - Disabled state
 *   - Disabled options
 *
 * - Validation and Feedback
 *   - Error messages
 *   - Help text
 *   - Required field
 *
 * - Accessibility
 *   - ARIA attributes
 *   - Label associations
 *
 * - Styling
 *   - Size variants
 *   - Custom classes
 */
describe('SelectField Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'test-select',
    options: defaultOptions,
    value: '',
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders select field with default props', () => {
      render(<SelectField {...defaultProps} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all options correctly', () => {
      render(<SelectField {...defaultProps} />);
      defaultOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('renders label when provided', () => {
      const label = 'Test Label';
      render(<SelectField {...defaultProps} label={label} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    it('renders default option', () => {
      const defaultOption = 'Choose an option';
      render(<SelectField {...defaultProps} defaultOption={defaultOption} />);
      expect(screen.getByText(defaultOption)).toBeInTheDocument();
    });
  });

  // Select behavior tests
  describe('Select Behavior', () => {
    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<SelectField {...defaultProps} onChange={handleChange} />);

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'option1' },
      });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('supports multiple selection', () => {
      render(<SelectField {...defaultProps} multiple />);
      const select = screen.getByRole('listbox');
      expect(select).toHaveAttribute('multiple');
    });

    it('respects disabled state', () => {
      render(<SelectField {...defaultProps} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('handles disabled options', () => {
      const optionsWithDisabled = [
        ...defaultOptions,
        { value: 'disabled', label: 'Disabled Option', disabled: true },
      ];

      render(<SelectField {...defaultProps} options={optionsWithDisabled} />);
      const disabledOption = screen.getByText('Disabled Option');
      expect(disabledOption.closest('option')).toHaveAttribute('disabled');
    });
  });

  // Validation and feedback tests
  describe('Validation and Feedback', () => {
    it('shows error message when provided', () => {
      const errorMessage = 'This field is required';
      render(<SelectField {...defaultProps} error={errorMessage} />);
      expect(screen.getByText(errorMessage)).toHaveClass('invalid-feedback');
    });

    it('shows help text when provided', () => {
      const helpText = 'Select your option';
      render(<SelectField {...defaultProps} helpText={helpText} />);
      expect(screen.getByText(helpText)).toHaveClass('form-text');
    });

    it('shows required indicator when required', () => {
      render(<SelectField {...defaultProps} label="Test Label" required />);
      expect(screen.getByText('*')).toHaveClass('text-danger');
    });

    it('applies validation classes correctly', () => {
      render(<SelectField {...defaultProps} error="Error" />);
      expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('associates help text with select via aria-describedby', () => {
      const helpText = 'Help text';
      render(<SelectField {...defaultProps} helpText={helpText} />);

      const select = screen.getByRole('combobox');
      const helpTextElement = screen.getByText(helpText);

      expect(select).toHaveAttribute('aria-describedby', helpTextElement.id);
    });

    it('applies custom aria-label', () => {
      const ariaLabel = 'Custom label';
      render(<SelectField {...defaultProps} aria-label={ariaLabel} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-label',
        ariaLabel
      );
    });

    it('associates label with select using htmlFor', () => {
      render(<SelectField {...defaultProps} label="Test Label" />);
      const select = screen.getByRole('combobox');
      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', defaultProps.id);
      expect(select).toHaveAttribute('id', defaultProps.id);
    });
  });

  // Style tests
  describe('Styling', () => {
    it('applies size classes correctly', () => {
      render(<SelectField {...defaultProps} size="lg" />);
      expect(screen.getByRole('combobox')).toHaveClass('form-select-lg');
    });

    it('applies custom className', () => {
      const customClass = 'custom-select';
      render(<SelectField {...defaultProps} className={customClass} />);
      expect(screen.getByRole('combobox')).toHaveClass(customClass);
    });
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches basic select snapshot', () => {
      const tree = renderer
        .create(<SelectField {...defaultProps} label="Basic Select" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches multiple select snapshot', () => {
      const tree = renderer
        .create(
          <SelectField
            {...defaultProps}
            multiple
            visibleOptions={3}
            label="Multiple Select"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches select with validation snapshot', () => {
      const tree = renderer
        .create(
          <SelectField
            {...defaultProps}
            label="Validated Select"
            error="Error message"
            helpText="Help text"
            required
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches select with disabled options snapshot', () => {
      const optionsWithDisabled = [
        ...defaultOptions,
        { value: 'disabled', label: 'Disabled Option', disabled: true },
      ];

      const tree = renderer
        .create(
          <SelectField
            {...defaultProps}
            options={optionsWithDisabled}
            label="Select with Disabled Option"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
