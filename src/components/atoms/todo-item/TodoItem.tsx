/**
 * TodoItem Component
 *
 * A React component that displays a single todo item in a card format with the following features:
 * - Shows todo title, description, and last updated timestamp.
 * - Checkbox to toggle completion status.
 * - Edit and Delete action buttons.
 * - Responsive layout with Bootstrap.
 * - Accessibility features.
 * - Visual indication of completed todos.
 *
 * @component
 * @example
 * ```tsx
 * <TodoItem
 *   todo={todoItem}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   onToggleComplete={handleToggleComplete}
 * />
 * ```
 *
 * @param {Object} props - Component props
 * @param {Todo} props.todo - The todo item to display
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onToggleComplete - Optional callback when completion status is toggled
 */

import React from 'react';

import Button from '@/components/atoms/button/Button';
import Checkbox from '@/components/atoms/checkbox/Checkbox';
import { Todo } from '@/types/todo.types';

type TodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row align-items-start g-3">
          {/* Checkbox and Content Column */}
          <div className="col">
            <Checkbox
              checked={todo.completed ?? false}
              onChange={() => onToggleComplete?.(todo.id)}
              id={`todo-${todo.id}`}
              value={todo.id}
            >
              <div className="ms-2">
                <h5 className="card-title mb-1 text-break">{todo.title}</h5>
                <h6 className="card-subtitle mb-2 text-body-secondary">
                  <i className="bi bi-clock me-1"></i>
                  Last updated: {new Date(todo.updatedAt).toLocaleString()}
                </h6>
                {todo.description && (
                  <p className="card-text text-break mb-0">
                    {todo.description}
                  </p>
                )}
              </div>
            </Checkbox>
          </div>

          {/* Action Buttons Column */}
          <div className="col-auto">
            <div className="btn-group">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(todo)}
                aria-label="Edit todo"
                data-testid={`edit-todo-${todo.id}`}
              >
                <i className="bi bi-pencil-square me-1"></i>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(todo.id)}
                aria-label="Delete todo"
                data-testid={`delete-todo-${todo.id}`}
              >
                <i className="bi bi-trash me-1"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
