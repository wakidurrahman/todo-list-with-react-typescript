/**
 * Local storage utility functions for managing todos
 * This module provides functions to interact with the browser's localStorage
 * for persisting todo items
 */

import { env } from '../config/env';
import { getMockTodos } from '../services/mockData';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from '../services/todoApi';
import { Todo } from '../types/todo.types';

// Key used to store todos in localStorage
const STORAGE_KEY = 'todos';

// Local Storage Functions
const getLocalTodos = (): Todo[] => {
  try {
    const todosJson = localStorage.getItem(STORAGE_KEY);

    // If no todos in localStorage or empty array, return mock data
    if (!todosJson || todosJson === '[]') {
      console.log('No todos in localStorage, returning mock data');
      const mockTodos = getMockTodos();
      saveLocalTodos(mockTodos);
      return mockTodos;
    }
    console.log('todosJson---', typeof todosJson);
    return JSON.parse(todosJson);
  } catch (error) {
    throw new Error('Failed to read todos from localStorage');
  }
};

const saveLocalTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    throw new Error('Failed to save todos to localStorage');
  }
};

const addLocalTodo = (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Todo => {
  const todos = getLocalTodos();
  const newTodo: Todo = {
    ...todo,
    completed: false,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  saveLocalTodos(todos);
  return newTodo;
};

const updateLocalTodo = (id: string, todoData: Partial<Todo>): Todo | null => {
  const todos = getLocalTodos();
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) return null;

  todos[index] = {
    ...todos[index],
    ...todoData,
    updatedAt: new Date(),
  };

  saveLocalTodos(todos);
  return todos[index];
};

const deleteLocalTodo = (id: string): boolean => {
  const todos = getLocalTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);

  if (filteredTodos.length === todos.length) return false;

  saveLocalTodos(filteredTodos);
  return true;
};

// Public Interface Functions
export const getTodos = async (): Promise<Todo[]> => {
  if (!env.USE_API) return getLocalTodos();

  try {
    return await fetchTodos();
  } catch (error) {
    throw new Error('Failed to fetch todos from API');
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (!env.USE_API) {
    saveLocalTodos(todos);
    return;
  }
  throw new Error('Save todos not supported in API mode');
};

export const addTodo = async (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Todo> => {
  if (!env.USE_API) return addLocalTodo(todo);

  try {
    return await createTodo(todo);
  } catch (error) {
    throw new Error('Failed to create todo in API');
  }
};

export const updateTodoInAPI = async (
  id: string,
  todoData: Partial<Todo>
): Promise<Todo | null> => {
  if (!env.USE_API) return updateLocalTodo(id, todoData);

  try {
    return await updateTodo(id, todoData);
  } catch (error) {
    throw new Error('Failed to update todo in API');
  }
};

export const deleteTodoInAPI = async (id: string): Promise<boolean> => {
  if (!env.USE_API) return deleteLocalTodo(id);

  try {
    await deleteTodo(id);
    return true;
  } catch (error) {
    throw new Error('Failed to delete todo from API');
  }
};
