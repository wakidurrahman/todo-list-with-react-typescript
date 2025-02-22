import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoItem from './TodoItem';

describe('TodoItem Component', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    createdAt: new Date('2024-02-16T09:00:00.000Z'),
    updatedAt: new Date('2024-02-16T09:00:00.000Z'),
  };

  // Snapshot Tests
  describe('Snapshots', () => {
    it('renders todo item correctly', () => {
      const { container } = render(
        <TodoItem todo={mockTodo} onEdit={() => {}} onDelete={() => {}} />
      );
      expect(container).toMatchSnapshot();
    });
  });

  // Unit Tests
  describe('Functionality', () => {
    const user = userEvent.setup();

    it('displays todo title and description', () => {
      render(
        <TodoItem todo={mockTodo} onEdit={() => {}} onDelete={() => {}} />
      );

      expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
      expect(screen.getByText(mockTodo.description)).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', async () => {
      const handleEdit = jest.fn();
      render(
        <TodoItem todo={mockTodo} onEdit={handleEdit} onDelete={() => {}} />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(handleEdit).toHaveBeenCalledWith(mockTodo);
    });

    it('calls onDelete when delete button is clicked', async () => {
      const handleDelete = jest.fn();
      render(
        <TodoItem todo={mockTodo} onEdit={() => {}} onDelete={handleDelete} />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(handleDelete).toHaveBeenCalledWith(mockTodo.id);
    });

    it('displays formatted dates', () => {
      render(
        <TodoItem todo={mockTodo} onEdit={() => {}} onDelete={() => {}} />
      );

      // Using a partial match for the date since formatting may vary
      const datePattern = /2\/16\/2024/;
      expect(screen.getByText(datePattern)).toBeInTheDocument();
    });

    it('has buttons with proper accessibility features', () => {
      render(
        <TodoItem todo={mockTodo} onEdit={() => {}} onDelete={() => {}} />
      );

      const editButton = screen.getByRole('button', { name: /edit/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });

      expect(editButton.querySelector('.bi-pencil-square')).toBeInTheDocument();
      expect(editButton).toHaveTextContent(/edit/i);

      expect(deleteButton.querySelector('.bi-trash')).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent(/delete/i);
    });
  });
});
