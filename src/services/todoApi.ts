import { Todo } from '../types/todo.types';

const API_URL = import.meta.env.VITE_API_URL;
const USE_API = import.meta.env.VITE_USE_API === 'true';

export const fetchTodos = async (): Promise<Todo[]> => {
  if (!USE_API) return [];

  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) throw new Error('Failed to fetch todos');

  const data = await response.json();
  return data.map((todo: Todo) => ({
    id: String(todo.id),
    title: todo.title,
    description: 'Demo description',
    completed: todo.completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

export const createTodo = async (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Todo> => {
  if (!USE_API) throw new Error('API is not enabled');

  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...todo,
      completed: false,
      userId: 1, // Default userId
    }),
  });
  if (!response.ok) throw new Error('Failed to create todo');

  const data = await response.json();
  return {
    ...todo,
    id: String(data.id),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const updateTodo = async (
  id: string,
  todoData: Partial<Todo>
): Promise<Todo> => {
  if (!USE_API) throw new Error('API is not enabled');

  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  if (!response.ok) throw new Error('Failed to update todo');

  const data = await response.json();
  return {
    ...data,
    id: String(data.id),
    updatedAt: new Date(),
  };
};

export const deleteTodo = async (id: string): Promise<void> => {
  if (!USE_API) throw new Error('API is not enabled');

  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
};
