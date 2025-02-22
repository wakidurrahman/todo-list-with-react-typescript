import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoApp from './TodoApp';

// Mock localStorage utility functions
jest.mock('../../../utils/storage', () => ({
  getTodos: jest.fn(),
  addTodo: jest.fn(),
  updateTodoInAPI: jest.fn(),
  deleteTodoInAPI: jest.fn(),
}));

// Add this line after the mock definition
const { getTodos, addTodo, updateTodoInAPI, deleteTodoInAPI } =
  jest.requireMock('../../../utils/storage');

describe('TodoApp Component', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'First Todo',
      description: 'First Description',
      completed: false,
      createdAt: new Date('2024-02-16T00:00:00.000Z'),
      updatedAt: new Date('2024-02-16T00:00:00.000Z'),
    },
    {
      id: '2',
      title: 'Second Todo',
      description: 'Second Description',
      completed: false,
      createdAt: new Date('2024-02-16T01:00:00.000Z'),
      updatedAt: new Date('2024-02-16T01:00:00.000Z'),
    },
  ];

  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (addTodo as jest.Mock).mockImplementation((data) => ({
      id: '3',
      ...data,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    (updateTodoInAPI as jest.Mock).mockImplementation((id, data) => ({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    (deleteTodoInAPI as jest.Mock).mockResolvedValue(true);
  });

  // Snapshot Tests
  describe('Snapshots', () => {
    it('renders correctly with todos', () => {
      const { container } = render(<TodoApp onError={mockOnError} />);
      expect(container).toMatchSnapshot();
    });

    it('renders correctly without todos', () => {
      (getTodos as jest.Mock).mockResolvedValue([]);
      const { container } = render(<TodoApp onError={mockOnError} />);
      expect(container).toMatchSnapshot();
    });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    it('loads todos and shows error on failure', async () => {
      const error = new Error('Failed to load todos');
      (getTodos as jest.Mock).mockRejectedValueOnce(error);

      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Failed to load todos. Please try again later.',
          'danger'
        );
      });
    });

    it('adds a new todo successfully', async () => {
      render(<TodoApp onError={mockOnError} />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(titleInput, 'New Todo');
      await user.type(descriptionInput, 'New Todo Description');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      expect(addTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Todo Description',
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Todo added successfully!',
          'success',
          3000
        );
      });
    });

    it('shows error when adding todo fails', async () => {
      (addTodo as jest.Mock).mockRejectedValueOnce(new Error('Failed to add'));
      render(<TodoApp onError={mockOnError} />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(titleInput, 'New Todo');
      await user.type(descriptionInput, 'New Todo Description');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Failed to add todo. Please try again.',
          'danger'
        );
      });
    });

    it('deletes a todo successfully', async () => {
      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByRole('button', {
        name: /delete/i,
      })[0];
      await user.click(deleteButton);

      expect(deleteTodoInAPI).toHaveBeenCalledWith('1');

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Todo deleted successfully!',
          'success',
          3000
        );
      });
    });

    it('shows error when todo deletion fails', async () => {
      (deleteTodoInAPI as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to delete')
      );
      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByRole('button', {
        name: /delete/i,
      })[0];
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Failed to delete todo. Please try again.',
          'danger'
        );
      });
    });

    it('shows warning when deleting non-existent todo', async () => {
      (deleteTodoInAPI as jest.Mock).mockResolvedValueOnce(false);
      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByRole('button', {
        name: /delete/i,
      })[0];
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Todo not found or already deleted.',
          'warning'
        );
      });
    });

    it('updates todo completion status successfully', async () => {
      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('First Todo');
      await user.click(checkbox);

      expect(updateTodoInAPI).toHaveBeenCalledWith('1', {
        ...mockTodos[0],
        completed: true,
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Todo marked as completed!',
          'success',
          3000
        );
      });
    });

    it('shows error when updating todo completion fails', async () => {
      (updateTodoInAPI as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to update')
      );
      render(<TodoApp onError={mockOnError} />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('First Todo');
      await user.click(checkbox);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Failed to update todo status. Please try again.',
          'danger'
        );
      });
    });
  });
});
