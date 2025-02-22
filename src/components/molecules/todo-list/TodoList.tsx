/**
 * TodoList Component
 *
 * A React component that displays a list of todo items with loading and empty states.
 * Features include:
 * - Loading spinner while data is being fetched
 * - Empty state message when no todos exist
 * - List of TodoItem components with consistent spacing
 * - Passes through edit, delete and toggle complete handlers
 * - Responsive layout with Bootstrap
 * - Accessibility features
 *
 * @component
 * @example
 * ```tsx
 * <TodoList
 *   loading={false}
 *   todos={todoItems}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggleComplete={handleToggleComplete}
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Loading state flag
 * @param {Todo[]} props.todos - Array of todo items to display
 * @param {Function} props.onEdit - Callback when edit is triggered for a todo
 * @param {Function} props.onDelete - Callback when delete is triggered for a todo
 * @param {Function} props.onToggleComplete - Callback when completion is toggled for a todo
 */

import Spinner from '@/components/atoms/spinner/Spinner';
import TodoItem from '@/components/atoms/todo-item/TodoItem';
import { Todo } from '@/types/todo.types';

type TodoListProps = {
  loading: boolean;
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
};

function TodoList({
  loading,
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
        <Spinner variant="primary" size="md" loadingText="Loading..." />
      </div>
    );
  }

  if (!loading && todos.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No todos yet. Add your first todo!
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-1">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TodoList;
