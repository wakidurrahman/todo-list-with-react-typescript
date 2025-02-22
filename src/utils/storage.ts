/**
 * Local storage utility functions for managing todos
 * This module provides functions to interact with the browser's localStorage
 * for persisting todo items
 */

import { createTodo, fetchTodos } from '../services/todoApi';
import { Todo } from '../types/todo.types';

// Key used to store todos in localStorage
const STORAGE_KEY = 'todos';
const USE_API = import.meta.env.VITE_USE_API === 'true';

/**
 * Retrieves all todos from localStorage
 * @returns {Todo[]} Array of todo items, empty array if none exist
 * @throws {Error} If API call fails and localStorage fallback is not available
 */
export const getTodos = async (): Promise<Todo[]> => {
  if (USE_API) {
    try {
      const todos = await fetchTodos();
      return todos;
    } catch (error) {
      // Try localStorage fallback
      try {
        return getLocalTodos();
      } catch (fallbackError) {
        throw new Error(
          'Failed to fetch todos: API unavailable and localStorage fallback failed'
        );
      }
    }
  }
  return getLocalTodos();
};

const getLocalTodos = (): Todo[] => {
  try {
    const todosJson = localStorage.getItem(STORAGE_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
  } catch (error) {
    throw new Error('Failed to read todos from localStorage');
  }
};

/**
 * Saves todos to localStorage
 * @param todos - Array of todo items to save
 * @throws {Error} If saving to localStorage fails
 */
export const saveTodos = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    throw new Error('Failed to save todos to localStorage');
  }
};

/**
 * Adds a new todo item
 * @param todo - Todo data without id and timestamps
 * @returns {Todo} Newly created todo with generated id and timestamps
 * @throws {Error} If creating todo fails in both API and localStorage
 */
export const addTodo = async (
  // Omit utility type excludes specified properties ('id', 'createdAt', 'updatedAt') from Todo type,
  // creating a new type with only the remaining properties
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Todo> => {
  if (USE_API) {
    try {
      const newTodo = await createTodo(todo);
      const todos = await getTodos();
      todos.push(newTodo);
      return newTodo;
    } catch (error) {
      // Try localStorage fallback
      try {
        return await addTodoToLocal(todo);
      } catch (fallbackError) {
        throw new Error(
          'Failed to create todo: API unavailable and localStorage fallback failed'
        );
      }
    }
  }
  return addTodoToLocal(todo);
};

const addTodoToLocal = async (
  todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Todo> => {
  const todos = await getTodos();
  const newTodo: Todo = {
    ...todo,
    completed: false,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
};

/**
 * Updates an existing todo item
 * @param id - ID of todo to update
 * @param todoData - Partial todo data to update
 * @returns {Todo | null} Updated todo or null if not found
 * @throws {Error} If updating todo fails
 */
export const updateTodo = async (
  id: string,
  /** Partial todo data containing only the fields that need to be updated */
  todoData: Partial<Todo>
): Promise<Todo | null> => {
  try {
    const todos = await getTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) return null;

    todos[index] = {
      ...todos[index],
      ...todoData,
      updatedAt: new Date(),
    };

    saveTodos(todos);
    return todos[index];
  } catch (error) {
    throw new Error(
      `Failed to update todo: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Deletes a todo item
 * @param id - ID of todo to delete
 * @returns {boolean} True if todo was deleted, false if not found
 * @throws {Error} If deleting todo fails
 */
export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    const todos = await getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length === todos.length) return false;

    saveTodos(filteredTodos);
    return true;
  } catch (error) {
    throw new Error(
      `Failed to delete todo: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
