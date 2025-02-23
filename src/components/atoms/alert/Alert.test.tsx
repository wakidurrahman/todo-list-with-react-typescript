import { act } from 'react';

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';

import Alert from './Alert';

/**
 * Alert Component Test Suite
 *
 * A comprehensive test suite covering all major functionality:
 *
 * 1. Basic Rendering
 *    - Default props rendering
 *    - Custom variant rendering
 *
 * 2. Dismissible Functionality
 *    - Close button presence/absence
 *    - Close button click handling
 *
 * 3. Show/Hide Behavior
 *    - Visibility toggle with show prop
 *
 * 4. Timeout Functionality
 *    - Auto-dismiss after timeout
 *    - Cleanup on unmount
 *
 * 5. Accessibility Features
 *    - ARIA attributes
 *    - Role attributes
 *
 * 6. Message Rendering
 *    - Text messages
 *    - Complex ReactNode messages
 */

describe('Alert Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Basic rendering tests
  it('renders with default props', () => {
    render(<Alert message="Test message" />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert', 'alert-info', 'alert-dismissible');
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with custom variant', () => {
    render(<Alert message="Success message" variant="success" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-success');
  });

  // Dismissible functionality tests
  it('renders without close button when dismissible is false', () => {
    render(<Alert message="Non-dismissible alert" dismissible={false} />);

    expect(screen.queryByLabelText('Close alert')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert message="Closeable alert" onClose={handleClose} />);

    const closeButton = screen.getByLabelText('Close alert');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Show/hide behavior tests
  it('hides when show prop is false', () => {
    const { rerender } = render(<Alert message="Hidden alert" show={false} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(<Alert message="Visible alert" show={true} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Timeout tests
  it('auto-dismisses after timeout', () => {
    const handleClose = jest.fn();
    render(
      <Alert
        message="Auto-dismiss alert"
        timeout={3000}
        onClose={handleClose}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Accessibility tests
  it('has correct accessibility attributes', () => {
    render(<Alert message="Accessible alert" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');

    const closeButton = screen.getByLabelText('Close alert');
    expect(closeButton).toHaveAttribute('aria-label', 'Close alert');
  });

  // Message rendering tests
  it('renders ReactNode message correctly', () => {
    const complexMessage = (
      <div>
        <h4>Alert Title</h4>
        <p>Alert content</p>
      </div>
    );

    render(<Alert message={complexMessage} />);

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  // Cleanup test
  it('cleans up timeout on unmount', () => {
    const handleClose = jest.fn();
    const { unmount } = render(
      <Alert message="Cleanup test" timeout={3000} onClose={handleClose} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(handleClose).not.toHaveBeenCalled();
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches default alert snapshot', () => {
      const tree = create(<Alert message="Default alert" />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches success variant snapshot', () => {
      const tree = create(
        <Alert message="Success alert" variant="success" />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches non-dismissible alert snapshot', () => {
      const tree = create(
        <Alert message="Non-dismissible alert" dismissible={false} />
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches complex message snapshot', () => {
      const complexMessage = (
        <div>
          <h4>Alert Title</h4>
          <p>Alert content</p>
        </div>
      );
      const tree = create(<Alert message={complexMessage} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
