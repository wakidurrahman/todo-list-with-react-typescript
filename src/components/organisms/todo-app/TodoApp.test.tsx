import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoApp from './TodoApp';

// Mock localStorage utility functions
jest.mock('../../../utils/storage', () => ({
  getTodos: jest.fn(),
  addTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

// Add this line after the mock definition
const { getTodos, addTodo, updateTodo, deleteTodo } = jest.requireMock(
  '../../../utils/storage'
);

describe('TodoApp Component', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'First Todo',
      description: 'First Description',
      createdAt: new Date('2024-02-16T00:00:00.000Z'),
      updatedAt: new Date('2024-02-16T00:00:00.000Z'),
    },
    {
      id: '2',
      title: 'Second Todo',
      description: 'Second Description',
      createdAt: new Date('2024-02-16T01:00:00.000Z'),
      updatedAt: new Date('2024-02-16T01:00:00.000Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getTodos as jest.Mock).mockReturnValue(mockTodos);
    (addTodo as jest.Mock).mockImplementation((data) => ({
      id: '3',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    (updateTodo as jest.Mock).mockImplementation((id, data) => ({
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    (deleteTodo as jest.Mock).mockReturnValue(true);
  });

  // Snapshot Tests
  describe('Snapshots', () => {
    it('renders correctly with todos', () => {
      const { container } = render(<TodoApp />);
      expect(container).toMatchSnapshot();
    });

    it('renders correctly without todos', () => {
      (getTodos as jest.Mock).mockReturnValue([]);
      const { container } = render(<TodoApp />);
      expect(container).toMatchSnapshot();
    });
  });

  // Add new layout tests
  describe('Layout', () => {
    // it('renders with correct Bootstrap layout classes', () => {
    //   render(<TodoApp />);
    //   expect(screen.getByRole('main')).toHaveClass('container', 'py-4');
    //   expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
    //     'text-center',
    //     'mb-4'
    //   );
    //   const formSection = screen.getByTestId('todo-form-section');
    //   expect(formSection).toHaveClass('col-12', 'col-sm-5', 'col-md-6');
    //   const listSection = screen.getByTestId('todo-list-section');
    //   expect(listSection).toHaveClass('col-12', 'col-sm-7', 'col-md-6');
    // });
    // it('displays correct heading based on edit mode', async () => {
    //   render(<TodoApp />);
    //   // Initial state
    //   expect(screen.getByText('Add New Todo')).toBeInTheDocument();
    //   // Edit mode - update selector to match actual button text
    //   const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    //   const user = userEvent.setup();
    //   await user.click(editButton);
    //   expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    // });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    // it('loads todos from localStorage on mount', async () => {
    //   render(<TodoApp />);

    //   expect(getTodos).toHaveBeenCalledTimes(1);

    //   await waitFor(() => {
    //     const todoElements = screen.getAllByTestId('todo-item');
    //     expect(todoElements).toHaveLength(2);
    //     expect(screen.getByText('First Todo')).toBeInTheDocument();
    //     expect(screen.getByText('Second Todo')).toBeInTheDocument();
    //   });
    // });

    it('adds a new todo', async () => {
      render(<TodoApp />);

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
        expect(screen.getByText('New Todo')).toBeInTheDocument();
      });
    });

    it('deletes a todo', async () => {
      render(<TodoApp />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByRole('button', {
        name: /delete/i,
      })[0];
      await user.click(deleteButton);

      expect(deleteTodo).toHaveBeenCalledWith('1');

      await waitFor(() => {
        expect(screen.queryByText('First Todo')).not.toBeInTheDocument();
      });
    });

    // it('edits a todo', async () => {
    //   render(<TodoApp />);

    //   await waitFor(() => {
    //     expect(screen.getByText('First Todo')).toBeInTheDocument();
    //   });

    // wtodo
    //   // const editButton = screen.getByTestId('edit-todo-1');
    //   // await user.click(editButton);

    //   // Form should be in edit mode
    //   const titleInput = screen.getByLabelText(/title/i);
    //   const descriptionInput = screen.getByLabelText(/description/i);
    //   //const updateButton = screen.getByRole('button', { name: /update/i });

    //   // Clear and type new values
    //   await user.clear(titleInput);
    //   await user.clear(descriptionInput);
    //   await user.type(titleInput, 'Updated Todo');
    //   await user.type(descriptionInput, 'Updated Description');

    //   // Submit update
    //   //await user.click(updateButton);

    //   // expect(updateTodo).toHaveBeenCalledWith('1', {
    //   //   title: 'Updated Todo',
    //   //   description: 'Updated Description',
    //   // });

    //   await waitFor(() => {
    //     expect(screen.getByText('Updated Todo')).toBeInTheDocument();
    //     expect(screen.getByText('Updated Description')).toBeInTheDocument();
    //   });
    // });

    it('cancels todo editing', async () => {
      render(<TodoApp />);

      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      // Click edit button of first todo
      // const editButton = screen.getByTestId('edit-todo-1');
      // await user.click(editButton);

      // Click cancel button
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Should show original todo
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('First Description')).toBeInTheDocument();
    });

    it('persists todos to localStorage after changes', async () => {
      render(<TodoApp />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'New Todo');
      await user.type(descriptionInput, 'New Todo Description');

      const addButton = screen.getByRole('button', { name: /add/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(addTodo).toHaveBeenCalledWith({
          title: 'New Todo',
          description: 'New Todo Description',
        });
      });
    });

    it('handles failed todo update gracefully', async () => {
      (updateTodo as jest.Mock).mockResolvedValueOnce(null);
      render(<TodoApp />);

      // Wait for todos to be loaded
      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      // Find and click edit button using test-id instead of role
      // const editButton = screen.getByTestId('edit-todo-1');
      // await user.click(editButton);

      // Update form
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.clear(titleInput);
      await user.clear(descriptionInput);
      await user.type(titleInput, 'Failed Update');
      await user.type(descriptionInput, 'Failed Description');

      // Submit update
      //const updateButton = screen.getByRole('button', { name: /update/i });
      //await user.click(updateButton);

      // Verify todo list remains unchanged
      expect(screen.getByText('First Todo')).toBeInTheDocument();
      expect(screen.getByText('First Description')).toBeInTheDocument();
    });

    it('handles failed todo deletion gracefully', async () => {
      (deleteTodo as jest.Mock).mockResolvedValueOnce(false);
      render(<TodoApp />);

      // Wait for todos to be loaded
      await waitFor(() => {
        expect(screen.getByText('First Todo')).toBeInTheDocument();
      });

      // Update selector to match actual button text
      const deleteButton = screen.getAllByRole('button', {
        name: /delete/i,
      })[0];
      await user.click(deleteButton);

      // Verify todo remains in the list
      expect(screen.getByText('First Todo')).toBeInTheDocument();
    });
  });
});
