import mockTodos from '@/data/todos.json';
import { Todo } from '@/types/todo.types';

export const getMockTodos = (): Todo[] => {
  return mockTodos.todos.map((todo) => ({
    ...todo,
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt),
    dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
  }));
};
