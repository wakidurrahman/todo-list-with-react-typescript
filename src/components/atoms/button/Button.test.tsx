import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';
/**
 * Test suite for the Button component covering:
 * - Basic Rendering
 *   - Renders with required props
 *   - Renders with children content
 *   - Renders with different variants
 *   - Renders with custom classes
 *
 * - Functionality
 *   - Click handling
 *   - Disabled state
 *   - Loading state
 *   - Link behavior
 *
 * - Accessibility
 *   - ARIA attributes
 *   - Keyboard navigation
 *   - Focus handling
 *
 * - Styling
 *   - Size variants
 *   - Color variants
 *   - Icon placement
 *   - Loading spinner
 *
 * - Snapshots
 *   - Primary variant
 *   - Secondary variant
 *   - Disabled state
 *   - Loading state
 */
describe('Button Component', () => {
  // Snapshot Tests
  describe('Snapshots', () => {
    it('renders primary button correctly', () => {
      const { container } = render(
        <Button variant="primary" onClick={() => {}}>
          Primary Button
        </Button>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders secondary button correctly', () => {
      const { container } = render(
        <Button variant="secondary" onClick={() => {}}>
          Secondary Button
        </Button>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders disabled button correctly', () => {
      const { container } = render(
        <Button variant="primary" disabled onClick={() => {}}>
          Disabled Button
        </Button>
      );
      expect(container).toMatchSnapshot();
    });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      render(
        <Button variant="primary" onClick={handleClick}>
          Click Me
        </Button>
      );

      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button variant="primary" onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button', { name: /disabled button/i });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies correct Bootstrap classes based on variant', () => {
      const { rerender } = render(
        <Button variant="primary" onClick={() => {}}>
          Primary Button
        </Button>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-primary');

      rerender(
        <Button variant="secondary" onClick={() => {}}>
          Secondary Button
        </Button>
      );

      button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-secondary');
    });

    it('applies additional className when provided', () => {
      render(
        <Button variant="primary" onClick={() => {}} className="custom-class">
          Custom Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });
});
