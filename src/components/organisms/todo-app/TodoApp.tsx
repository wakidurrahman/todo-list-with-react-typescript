/**
 * TodoApp Component
 *
 * A React component that implements a complete todo list application with CRUD operations.
 * Features include:
 * - Viewing all todos with filtering and sorting capabilities
 * - Adding new todos with validation
 * - Editing existing todos with history tracking
 * - Deleting todos with confirmation
 * - Marking todos as complete/incomplete
 * - Persisting todos in localStorage or remote API
 * - Responsive layout with Bootstrap
 * - Accessibility features
 * - Error handling and loading states
 *
 * @component
 * @example
 * ```tsx
 * <TodoApp />
 * ```
 */

import { useEffect, useState } from 'react';

import TodoForm from '@/components/molecules/todo-form/TodoForm';
import TodoList from '@/components/molecules/todo-list/TodoList';
import {
  addTodo,
  deleteTodoInAPI,
  getTodos,
  updateTodoInAPI,
} from '@/utils/storage';

import type { AlertVariant } from '@/types/error.types';
import type { Todo, TodoFormData } from '@/types/todo.types';

type TodoAppProps = {
  onError: (message: string, variant?: AlertVariant, timeout?: number) => void;
};

const TodoApp = ({ onError }: TodoAppProps) => {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoBeingEdited, setTodoBeingEdited] = useState<Todo | null>(null);

  useEffect(() => {
    const handleLoadTodos = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos);
      } catch (error) {
        setLoading(false);
        onError('Failed to load todos. Please try again later.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    handleLoadTodos();
  }, [onError]);

  const handleAddTodo = async (data: TodoFormData) => {
    try {
      const newTodo = await addTodo(data);
      setTodos((prev) => [...prev, newTodo]);
      onError('Todo added successfully!', 'success', 3000);
    } catch (error) {
      onError('Failed to add todo. Please try again.', 'danger');
    }
  };

  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!todoBeingEdited) return;

    try {
      const updatedTodo = await updateTodoInAPI(todoBeingEdited.id, data);
      if (!updatedTodo) {
        onError('Todo not found or already deleted.', 'warning');
        return;
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoBeingEdited.id ? updatedTodo : todo
        )
      );
      setTodoBeingEdited(null);
      onError('Todo updated successfully!', 'success', 3000);
    } catch (error) {
      onError('Failed to update todo. Please try again.', 'danger');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const isDeleted = await deleteTodoInAPI(id);
      if (!isDeleted) {
        onError('Todo not found or already deleted.', 'warning');
        return;
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      onError('Todo deleted successfully!', 'success', 3000);
    } catch (error) {
      onError('Failed to delete todo. Please try again.', 'danger');
    }
  };

  const handleEditClick = (todo: Todo) => {
    setTodoBeingEdited(todo);
  };

  const handleCancelEdit = () => {
    setTodoBeingEdited(null);
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      onError('Todo not found.', 'warning');
      return;
    }

    try {
      const updatedTodo = await updateTodoInAPI(id, {
        ...todo,
        completed: !todo.completed,
      });
      if (!updatedTodo) {
        onError('Failed to update todo status.', 'warning');
        return;
      }

      setTodos((prev) =>
        prev.map((item) => (item.id === id ? updatedTodo : item))
      );
      onError(
        `Todo marked as ${updatedTodo.completed ? 'completed' : 'incomplete'}!`,
        'success',
        3000
      );
    } catch (error) {
      onError('Failed to update todo status. Please try again.', 'danger');
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Todo List Application</h1>
      <div className="row">
        <div className="col-12 col-sm-5 col-md-6">
          <div className="card p-3 mb-4">
            <h3 className="mb-3">
              {todoBeingEdited ? 'Edit Todo' : 'Add New Todo'}
            </h3>
            <TodoForm
              onSubmit={todoBeingEdited ? handleUpdateTodo : handleAddTodo}
              editingTodo={todoBeingEdited || undefined}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
        <div className="col-12 col-sm-7 col-md-6">
          <TodoList
            loading={loading}
            todos={todos}
            onEdit={handleEditClick}
            onDelete={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
