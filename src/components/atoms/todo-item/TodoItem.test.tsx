import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

import { Priority, Todo } from '@/types/todo.types';

import TodoItem from './TodoItem';

/**
 * Test suite for the TodoItem component
 *
 * Categories:
 * - Basic Rendering
 *   - Todo details (title, description, dates)
 *   - Priority badges
 *   - Completion status
 *
 * - User Interactions
 *   - Toggle completion
 *   - Edit todo
 *   - Delete todo
 *
 * - Visual States
 *   - Completed todo styling
 *   - Overdue todo styling
 *   - Priority colors
 *
 * - Accessibility
 *   - ARIA labels
 *   - Keyboard navigation
 */
describe('TodoItem Component', () => {
  const mockDate = new Date('2024-02-23T12:00:00Z');
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'high',
    createdAt: mockDate,
    updatedAt: mockDate,
    dueDate: new Date(mockDate.getTime() + 86400000), // Tomorrow
  };

  const defaultProps = {
    todo: mockTodo,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onToggleComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe('Basic Rendering', () => {
    it('renders todo details correctly', () => {
      render(<TodoItem {...defaultProps} />);

      // Ensure non-null values for text matching
      expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
      if (mockTodo.description) {
        expect(screen.getByText(mockTodo.description)).toBeInTheDocument();
      }
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
      expect(screen.getByText(/Due:/)).toBeInTheDocument();
    });

    it('renders priority badge with correct color', () => {
      render(<TodoItem {...defaultProps} />);

      const badge = screen.getByText(mockTodo.priority as string);
      expect(badge).toHaveClass('bg-danger'); // high priority = danger
    });

    it('formats dates correctly', () => {
      render(<TodoItem {...defaultProps} />);

      expect(
        screen.getByText(new RegExp(mockDate.toLocaleString()))
      ).toBeInTheDocument();
    });

    it('handles missing optional fields', () => {
      const minimalTodo: Todo = {
        id: '2',
        title: 'Minimal Todo',
        priority: 'low',
        completed: false,
      };

      render(<TodoItem {...defaultProps} todo={minimalTodo} />);

      expect(screen.getByText('Minimal Todo')).toBeInTheDocument();
      expect(screen.queryByText(/Description/)).not.toBeInTheDocument();
      expect(screen.getByText(/Updated: Never/)).toBeInTheDocument();
    });
  });

  // User interaction tests
  describe('User Interactions', () => {
    it('calls onToggleComplete when checkbox is clicked', () => {
      render(<TodoItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(defaultProps.onToggleComplete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('calls onEdit when edit button is clicked', () => {
      render(<TodoItem {...defaultProps} />);

      const editButton = screen.getByTestId(`edit-todo-${mockTodo.id}`);
      fireEvent.click(editButton);

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTodo);
    });

    it('calls onDelete when delete button is clicked', () => {
      render(<TodoItem {...defaultProps} />);

      const deleteButton = screen.getByTestId(`delete-todo-${mockTodo.id}`);
      fireEvent.click(deleteButton);

      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTodo.id);
    });
  });

  // Visual state tests
  describe('Visual States', () => {
    it('applies strike-through style when todo is completed', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(<TodoItem {...defaultProps} todo={completedTodo} />);

      expect(screen.getByText(completedTodo.title)).toHaveClass(
        'text-decoration-line-through'
      );
      if (completedTodo.description) {
        expect(screen.getByText(completedTodo.description)).toHaveClass(
          'text-decoration-line-through'
        );
      }
    });

    it('shows overdue status with correct styling', () => {
      const overdueTodo = {
        ...mockTodo,
        dueDate: new Date(Date.now() - 86400000), // Yesterday
      };
      render(<TodoItem {...defaultProps} todo={overdueTodo} />);

      const dueDate = screen.getByText(/Due:/);
      expect(dueDate).toHaveClass('text-danger');
    });

    it('applies correct priority badge colors', () => {
      const priorities: Priority[] = ['high', 'medium', 'low'];
      const colorMap = { high: 'danger', medium: 'warning', low: 'info' };

      priorities.forEach((priority) => {
        const { rerender } = render(
          <TodoItem {...defaultProps} todo={{ ...mockTodo, priority }} />
        );

        expect(screen.getByText(priority)).toHaveClass(
          `bg-${colorMap[priority]}`
        );
        rerender(<></>);
      });
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('has correct ARIA labels for interactive elements', () => {
      render(<TodoItem {...defaultProps} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute(
        'aria-label',
        `Mark "${mockTodo.title}" as complete`
      );

      const editButton = screen.getByTestId(`edit-todo-${mockTodo.id}`);
      expect(editButton).toHaveAttribute(
        'aria-label',
        `Edit todo "${mockTodo.title}"`
      );

      const deleteButton = screen.getByTestId(`delete-todo-${mockTodo.id}`);
      expect(deleteButton).toHaveAttribute(
        'aria-label',
        `Delete todo "${mockTodo.title}"`
      );
    });

    it('uses semantic HTML elements', () => {
      render(<TodoItem {...defaultProps} />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument(); // title
      expect(screen.getAllByRole('heading', { level: 6 })).toHaveLength(2); // dates
    });
  });

  // Snapshot tests
  describe('Snapshots', () => {
    it('matches basic todo snapshot', () => {
      const tree = renderer.create(<TodoItem {...defaultProps} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches completed todo snapshot', () => {
      const tree = renderer
        .create(
          <TodoItem {...defaultProps} todo={{ ...mockTodo, completed: true }} />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches overdue todo snapshot', () => {
      const tree = renderer
        .create(
          <TodoItem
            {...defaultProps}
            todo={{
              ...mockTodo,
              dueDate: new Date(Date.now() - 86400000), // Yesterday
            }}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('matches minimal todo snapshot', () => {
      const minimalTodo: Todo = {
        id: '2',
        title: 'Minimal Todo',
        priority: 'low',
        completed: false,
      };

      const tree = renderer
        .create(<TodoItem {...defaultProps} todo={minimalTodo} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
