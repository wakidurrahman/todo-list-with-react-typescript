/**
 * TodoItem Component
 *
 * A React component that displays a single todo item in a card format with the following features:
 * - Shows todo title, description, priority, due date and last updated timestamp
 * - Checkbox to toggle completion status
 * - Edit and Delete action buttons
 * - Responsive layout with Bootstrap classes
 * - Accessibility features including ARIA labels and keyboard navigation
 * - Visual indication of completed todos and overdue items
 * - Priority badges with color coding
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

import Button from '@/components/atoms/button/Button';
import Checkbox from '@/components/atoms/checkbox/Checkbox';
import { Priority, Todo } from '@/types/todo.types';

type TodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
};

// Priority color mapping for badges
const priorityColors: Record<Priority, string> = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

const TodoItem = ({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoItemProps) => {
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date();

  return (
    <div className="card mb-1" data-testid={`todo-item-${todo.id}`}>
      <div className="card-body">
        <div className="row align-items-start g-2">
          {/* Checkbox and Content Column */}
          <div className="col">
            <Checkbox
              checked={todo.completed ?? false}
              onChange={() => onToggleComplete?.(todo.id)}
              id={`todo-${todo.id}`}
              value={todo.id}
              aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            >
              <div className="ms-2">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <h5
                    className={`card-title mb-0 text-break ${todo.completed ? 'text-decoration-line-through' : ''}`}
                  >
                    {todo.title}
                  </h5>
                  <span
                    className={`badge bg-${priorityColors[todo.priority as Priority]}`}
                    title={`Priority: ${todo.priority}`}
                  >
                    {todo.priority}
                  </span>
                </div>

                <h6 className="card-subtitle text-body-secondary mb-2">
                  <i className="bi bi-clock me-1" aria-hidden="true"></i>
                  Updated:{' '}
                  {todo.updatedAt
                    ? new Date(todo.updatedAt).toLocaleString()
                    : 'Never'}
                </h6>
                {todo.dueDate && (
                  <h6
                    className={`card-subtitle mb-0 ${isOverdue ? 'text-danger' : 'text-body-secondary'}`}
                  >
                    <i
                      className="bi bi-calendar-event me-1"
                      aria-hidden="true"
                    ></i>
                    Due: {new Date(todo.dueDate).toLocaleString()}
                  </h6>
                )}

                {todo.description && (
                  <p
                    className={`card-text text-break mt-2 mb-0 ${todo.completed ? 'text-decoration-line-through' : ''}`}
                  >
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
                aria-label={`Edit todo "${todo.title}"`}
                data-testid={`edit-todo-${todo.id}`}
              >
                <i className="bi bi-pencil-square me-1" aria-hidden="true"></i>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(todo.id)}
                aria-label={`Delete todo "${todo.title}"`}
                data-testid={`delete-todo-${todo.id}`}
              >
                <i className="bi bi-trash me-1" aria-hidden="true"></i>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
