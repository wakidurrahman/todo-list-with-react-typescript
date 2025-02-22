import { Todo } from '../../../types/todo.types';
import TodoItem from '../../atoms/todo-item/TodoItem';

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
      <div className="d-flex justify-content-center mb-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
    <div className="d-flex flex-column gap-3">
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
