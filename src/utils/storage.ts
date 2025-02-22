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
 */
export const getTodos = async (): Promise<Todo[]> => {
  if (USE_API) {
    try {
      const todos = await fetchTodos();
      return todos;
    } catch (error) {
      console.error('Failed to fetch todos from API:', error);
      // Fallback to localStorage if API fails
      return getLocalTodos();
    }
  }
  return getLocalTodos();
};

const getLocalTodos = (): Todo[] => {
  const todosJson = localStorage.getItem(STORAGE_KEY);
  return todosJson ? JSON.parse(todosJson) : [];
};

/**
 * Saves todos to localStorage
 * @param todos - Array of todo items to save
 */
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

/**
 * Adds a new todo item
 * @param todo - Todo data without id and timestamps
 * @returns {Todo} Newly created todo with generated id and timestamps
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
      console.error('Failed to create todo in API:', error);
      // Fallback to localStorage
    }
  }

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
 */
export const updateTodo = async (
  id: string,
  /** Partial todo data containing only the fields that need to be updated */
  todoData: Partial<Todo>
): Promise<Todo | null> => {
  try {
    // Get all todos from localStorage
    const todos = await getTodos();
    // Find the index of the todo with the specified id
    const index = todos.findIndex((todo) => todo.id === id);
    // If the todo is not found, return null
    if (index === -1) return Promise.resolve(null);
    // Update the todo with the specified id with the new data
    todos[index] = {
      ...todos[index],
      ...todoData,
      updatedAt: new Date(),
    };
    // Save the updated todos to localStorage
    saveTodos(todos);
    // Return the updated todo
    return Promise.resolve(todos[index]);
  } catch (error) {
    console.error('Failed to update todo:', error);
    return Promise.resolve(null);
  }
};

/**
 * Deletes a todo item
 * @param id - ID of todo to delete
 * @returns {boolean} True if todo was deleted, false if not found
 */
export const deleteTodo = async (id: string): Promise<boolean> => {
  // Get all todos from localStorage
  const todos = await getTodos();
  // Filter out the todo with the specified id
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  // If the length of the filtered todos is the same as the original todos,
  // it means the todo was not found and not deleted
  if (filteredTodos.length === todos.length) return false;
  // Save the updated todos to localStorage
  saveTodos(filteredTodos);
  // Return true if the todo was deleted
  return true;
};
