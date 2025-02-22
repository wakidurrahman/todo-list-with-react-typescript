/**
 * Represents a Todo item in the application
 * @interface Todo
 */
export type Todo = {
  /** Unique identifier for the todo */
  id: string;
  /** Title/name of the todo item */
  title: string;
  /** Detailed description of the todo item */
  description?: string;
  /** Status of the todo item */
  completed?: boolean;
  /** Date when the todo was created */
  createdAt: Date;
  /** Date when the todo was last updated */
  updatedAt: Date;
};

/**
 * Data required to create or update a Todo item
 * @interface TodoFormData
 */
export type TodoFormData = {
  /** Title/name of the todo item */
  title: string;
  /** Detailed description of the todo item */
  description: string;
};

export type TodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
};

export type TodoListProps = {
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
};
