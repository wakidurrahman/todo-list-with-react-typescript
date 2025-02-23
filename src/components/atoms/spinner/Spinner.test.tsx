import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import Spinner from './Spinner';

/**
 * Test suite for the Spinner component
 *
 * Categories:
 * - Basic Rendering
 *   - Default spinner rendering
 *   - Loading text
 *
 * - Variants
 *   - Color variants
 *   - Size variants
 *
 * - Styling
 *   - Custom classes
 *   - Size classes
 *
 * - Accessibility
 *   - ARIA attributes
 *   - Screen reader text
 */
describe('Spinner Component', () => {
  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('spinner-border', 'text-primary');
    });

    it('renders default loading text', () => {
      render(<Spinner />);
      expect(screen.getByText('Loading...')).toHaveClass('visually-hidden');
    });

    it('renders custom loading text', () => {
      const loadingText = 'Please wait...';
      render(<Spinner loadingText={loadingText} />);
      expect(screen.getByText(loadingText)).toHaveClass('visually-hidden');
    });
  });

  // Variant tests
  describe('Variants', () => {
    const variants = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
    ] as const;

    variants.forEach((variant) => {
      it(`applies ${variant} variant class correctly`, () => {
        render(<Spinner variant={variant} />);
        expect(screen.getByRole('status')).toHaveClass(`text-${variant}`);
      });
    });

    it('applies size variants correctly', () => {
      const { rerender } = render(<Spinner size="sm" />);
      expect(screen.getByRole('status')).toHaveClass('spinner-border-sm');

      rerender(<Spinner size="md" />);
      expect(screen.getByRole('status')).not.toHaveClass('spinner-border-sm');
      expect(screen.getByRole('status')).not.toHaveClass('spinner-border-lg');

      rerender(<Spinner size="lg" />);
      expect(screen.getByRole('status')).toHaveClass(
        'spinner-border',
        'spinner-border-lg'
      );
    });
  });

  // Style tests
  describe('Styling', () => {
    it('applies custom className', () => {
      const customClass = 'custom-spinner';
      render(<Spinner className={customClass} />);
      expect(screen.getByRole('status')).toHaveClass(customClass);
    });

    it('combines multiple classes correctly', () => {
      render(<Spinner className="m-2 p-2" variant="success" size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass(
        'spinner-border',
        'spinner-border-sm',
        'text-success',
        'm-2',
        'p-2'
      );
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('role', 'status');
      expect(spinner).toHaveAttribute('aria-live', 'polite');
    });

    it('hides loading text visually but keeps it accessible', () => {
      const loadingText = 'Custom loading message';
      render(<Spinner loadingText={loadingText} />);
      const hiddenText = screen.getByText(loadingText);
      expect(hiddenText).toHaveClass('visually-hidden');
      expect(hiddenText).toBeInTheDocument();
    });
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches default spinner snapshot', () => {
      const tree = renderer.create(<Spinner />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches custom variant and size snapshot', () => {
      const tree = renderer
        .create(
          <Spinner
            variant="success"
            size="lg"
            loadingText="Custom loading..."
            className="m-3"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches small spinner with custom text snapshot', () => {
      const tree = renderer
        .create(
          <Spinner size="sm" variant="warning" loadingText="Processing..." />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
