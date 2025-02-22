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
        <TodoList
          todos={mockTodos}
          loading={false}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it('renders empty list correctly', () => {
      const { container } = render(
        <TodoList
          todos={[]}
          loading={false}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
        />
      );
      expect(container).toMatchSnapshot();
    });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    it('displays all todos in the list', () => {
      render(
        <TodoList
          todos={mockTodos}
          loading={false}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
        />
      );

      mockTodos.forEach((todo) => {
        expect(screen.getByText(todo.title)).toBeInTheDocument();
        expect(screen.getByText(todo.description)).toBeInTheDocument();
      });
    });

    it('calls onEdit with correct todo when edit button is clicked', async () => {
      const handleEdit = jest.fn();
      render(
        <TodoList
          todos={mockTodos}
          loading={false}
          onEdit={handleEdit}
          onDelete={() => {}}
          onToggleComplete={() => {}}
        />
      );

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(handleEdit).toHaveBeenCalledWith(mockTodos[0]);
    });

    it('calls onDelete with correct id when delete button is clicked', async () => {
      const handleDelete = jest.fn();
      render(
        <TodoList
          todos={mockTodos}
          loading={false}
          onEdit={() => {}}
          onDelete={handleDelete}
          onToggleComplete={() => {}}
        />
      );

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);

      expect(handleDelete).toHaveBeenCalledWith(mockTodos[1].id);
    });
    it('displays "No todos found" message when list is empty', () => {
      render(
        <TodoList
          todos={[]}
          loading={false}
          onEdit={() => {}}
          onDelete={() => {}}
          onToggleComplete={() => {}}
        />
      );

      expect(
        screen.getByText(/no todos yet. add your first todo!/i)
      ).toBeInTheDocument();
    });
  });
});
