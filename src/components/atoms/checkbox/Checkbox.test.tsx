import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import Checkbox from './Checkbox';

/**
 * Test suite for the Checkbox component covering:
 * - Basic Rendering
 *   - Renders with required props
 *   - Renders with children content
 * - Functionality
 *   - Checked state handling
 *   - onChange event handling
 * - Styling
 *   - Strike-through style when checked
 *   - Normal style when unchecked
 * - Accessibility
 *   - ARIA attributes
 *   - Label associations (htmlFor/id)
 * - Value Handling
 *   - Custom value attribute
 * - Snapshots
 *   - Unchecked state
 *   - Checked state
 *   - Custom attributes
 */
describe('Checkbox Component', () => {
  const defaultProps = {
    id: 'test-checkbox',
    checked: false,
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  it('renders with required props', () => {
    render(<Checkbox {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders with children content', () => {
    const childText = 'Checkbox Label';
    render(<Checkbox {...defaultProps}>{childText}</Checkbox>);

    expect(screen.getByLabelText(childText)).toBeInTheDocument();
  });

  // Functionality tests
  it('handles checked state correctly', () => {
    render(<Checkbox {...defaultProps} checked={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={handleChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Style tests
  it('applies strike-through style to label when checked', () => {
    render(
      <Checkbox {...defaultProps} checked={true}>
        Label Text
      </Checkbox>
    );

    const label = screen.getByText('Label Text');
    expect(label).toHaveClass('text-decoration-line-through');
  });

  it('does not apply strike-through style when unchecked', () => {
    render(
      <Checkbox {...defaultProps} checked={false}>
        Label Text
      </Checkbox>
    );

    const label = screen.getByText('Label Text');
    expect(label).not.toHaveClass('text-decoration-line-through');
  });

  // Accessibility tests
  it('renders with correct accessibility attributes', () => {
    const ariaLabel = 'Custom checkbox label';
    render(<Checkbox {...defaultProps} ariaLabel={ariaLabel} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', ariaLabel);
  });

  it('associates label with input using htmlFor', () => {
    render(<Checkbox {...defaultProps}>Label Text</Checkbox>);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Label Text');
    expect(label).toHaveAttribute('for', defaultProps.id);
    expect(checkbox).toHaveAttribute('id', defaultProps.id);
  });

  // Value handling test
  it('renders with custom value', () => {
    const value = 'custom-value';
    render(<Checkbox {...defaultProps} value={value} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('value', value);
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches unchecked checkbox snapshot', () => {
      const tree = renderer
        .create(<Checkbox {...defaultProps}>Unchecked Item</Checkbox>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches checked checkbox snapshot', () => {
      const tree = renderer
        .create(
          <Checkbox {...defaultProps} checked={true}>
            Checked Item
          </Checkbox>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches checkbox with custom attributes snapshot', () => {
      const tree = renderer
        .create(
          <Checkbox
            {...defaultProps}
            ariaLabel="Custom label"
            value="custom-value"
          >
            Custom Checkbox
          </Checkbox>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
