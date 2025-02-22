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

import { Todo, TodoFormData } from '../../../types/todo.types';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../../../utils/storage';
import TodoForm from '../../molecules/todo-form/TodoForm';
import TodoList from '../../molecules/todo-list/TodoList';

const TodoApp = () => {
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
        console.error('Failed to load todos:', error);
      } finally {
        setLoading(false);
      }
    };
    handleLoadTodos();
  }, []);

  const handleAddTodo = async (data: TodoFormData) => {
    try {
      const newTodo = await addTodo(data);
      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleUpdateTodo = async (data: TodoFormData) => {
    if (!todoBeingEdited) return;

    try {
      const updatedTodo = await updateTodo(todoBeingEdited.id, data);
      if (!updatedTodo) return;

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === todoBeingEdited.id ? updatedTodo : todo
        )
      );
      setTodoBeingEdited(null);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const isDeleted = await deleteTodo(id);
      if (!isDeleted) return;

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
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
    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(id, {
        ...todo,
        completed: !todo.completed,
      });
      if (!updatedTodo) return;

      setTodos((prev) =>
        prev.map((item) => (item.id === id ? updatedTodo : item))
      );
    } catch (error) {
      console.error('Failed to toggle todo completion:', error);
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
