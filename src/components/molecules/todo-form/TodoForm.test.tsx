import { act } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoForm from './TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in add mode', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    // Check for form elements using more specific queries
    const titleLabel = screen.getByText('Title');
    const descriptionLabel = screen.getByText('Description');
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    const descriptionInput = screen.getByRole('textbox', {
      name: /description/i,
    });
    const addButton = screen.getByRole('button', { name: /add todo/i });

    expect(titleLabel).toBeInTheDocument();
    expect(descriptionLabel).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  it('renders correctly in edit mode', () => {
    const mockTodo = {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        editingTodo={mockTodo}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /update todo/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /add todo/i });
      await user.click(submitButton);
    });

    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates minimum length requirements', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'ab');
      await user.type(descriptionInput, 'short');

      const submitButton = screen.getByRole('button', { name: /add todo/i });
      await user.click(submitButton);
    });

    expect(
      screen.getByText(/title must be at least 3 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/description must be at least 10 characters/i)
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'Valid Title');
      await user.type(
        descriptionInput,
        'Valid description that is long enough'
      );

      const submitButton = screen.getByRole('button', { name: /add todo/i });
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Valid Title',
        description: 'Valid description that is long enough',
      });
    });
  });

  it('handles cancel button click', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await act(async () => {
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('resets form after successful submission', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'Valid Title');
      await user.type(
        descriptionInput,
        'Valid description that is long enough'
      );

      const submitButton = screen.getByRole('button', { name: /add todo/i });
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
    });
  });

  it('updates form data in edit mode', async () => {
    const mockTodo = {
      id: '1',
      title: 'Original Title',
      description: 'Original Description',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <TodoForm
        onSubmit={mockOnSubmit}
        editingTodo={mockTodo}
        onCancel={mockOnCancel}
      />
    );

    await act(async () => {
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.clear(titleInput);
      await user.clear(descriptionInput);
      await user.type(titleInput, 'Updated Title');
      await user.type(descriptionInput, 'Updated description that is valid');

      const submitButton = screen.getByRole('button', { name: /update todo/i });
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: 'Updated description that is valid',
      });
    });
  });
});
