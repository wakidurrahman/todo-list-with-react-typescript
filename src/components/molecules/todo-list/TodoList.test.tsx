import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoList from './TodoList';

describe('TodoList Component', () => {
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

  // Snapshot Tests
  describe('Snapshots', () => {
    it('renders list with todos correctly', () => {
      const { container } = render(
        <TodoList todos={mockTodos} onEdit={() => {}} onDelete={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });

    it('renders empty list correctly', () => {
      const { container } = render(
        <TodoList todos={[]} onEdit={() => {}} onDelete={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    it('displays all todos in the list', () => {
      render(
        <TodoList todos={mockTodos} onEdit={() => {}} onDelete={() => {}} />
      );

      mockTodos.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
        expect(screen.getByText(todo.description)).toBeInTheDocument();
      });
    });

    it('calls onEdit with correct todo when edit button is clicked', async () => {
      const handleEdit = jest.fn();
      render(
        <TodoList todos={mockTodos} onEdit={handleEdit} onDelete={() => {}} />
      );

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(handleEdit).toHaveBeenCalledWith(mockTodos[0]);
    });

    it('calls onDelete with correct id when delete button is clicked', async () => {
      const handleDelete = jest.fn();
      render(
        <TodoList todos={mockTodos} onEdit={() => {}} onDelete={handleDelete} />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      expect(handleDelete).toHaveBeenCalledWith(mockTodos[1].id);
    });

    it('displays "No todos found" message when list is empty', () => {
      render(<TodoList todos={[]} onEdit={() => {}} onDelete={() => {}} />);

      expect(
        screen.getByText(/no todos yet. add your first todo!/i)
      ).toBeInTheDocument();
    });

    // it('renders todos in correct order (newest first)', () => {
    //   render(
    //     <TodoList todos={mockTodos} onEdit={() => {}} onDelete={() => {}} />
    //   );

    //   const todoElements = screen.getAllByTestId('todo-card');
    //   expect(todoElements[0]).toHaveTextContent(mockTodos[0].title);
    //   expect(todoElements[1]).toHaveTextContent(mockTodos[1].title);
    // });
  });
});
