import { Todo } from '../types/todo.types';

const API_URL = import.meta.env.VITE_API_URL;
const USE_API = import.meta.env.VITE_USE_API === 'true';

export const fetchTodos = async (): Promise<Todo[]> => {
  if (!USE_API) return [];

  const response = await fetch(`${API_URL}/todos`);
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
    body: JSON.stringify(todo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const data = await response.json();
  return {
    ...todo,
    id: String(data.id),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
