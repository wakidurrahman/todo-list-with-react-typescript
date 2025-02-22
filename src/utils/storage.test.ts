import { Todo } from '../types/todo.types';

import {
  addTodo,
  deleteTodo,
  getTodos,
  saveTodos,
  updateTodo,
} from './storage';

// Mock the todoApi functions
jest.mock('../services/todoApi', () => ({
  fetchTodos: jest.fn(),
  createTodo: jest.fn(),
}));

// Mock crypto.randomUUID properly
beforeAll(() => {
  global.crypto = {
    randomUUID: jest.fn(() => 'test-uuid'),
    subtle: {} as SubtleCrypto,
    getRandomValues: jest.fn(),
  } as unknown as Crypto;
});

// Mock the USE_API environment variable
jest.mock('../utils/env', () => ({
  USE_API: false,
}));

describe('localStorage utility functions', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date('2025-02-16T12:48:18.935Z'),
      updatedAt: new Date('2025-02-16T12:48:18.935Z'),
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: false,
      createdAt: new Date('2025-02-16T12:48:18.935Z'),
      updatedAt: new Date('2025-02-16T12:48:18.935Z'),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(global.localStorage, 'getItem');
    jest.spyOn(global.localStorage, 'setItem');
  });

  describe('getTodos', () => {
    it('should retrieve todos from localStorage', async () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));
      const todos = await getTodos();
      expect(localStorage.getItem).toHaveBeenCalledWith('todos');
      expect(todos).toEqual(mockTodos);
    });

    it('should return an empty array if no todos are in localStorage', async () => {
      const todos = await getTodos();
      expect(todos).toEqual([]);
    });
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage', () => {
      saveTodos(mockTodos);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'todos',
        JSON.stringify(mockTodos)
      );
    });
  });

  describe('addTodo', () => {
    it('should add a new todo and save it to localStorage', async () => {
      const newTodoData = {
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      };
      const newTodo = await addTodo(newTodoData);

      expect(newTodo).toMatchObject({
        ...newTodoData,
        id: 'test-uuid',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const todos = await getTodos();
      expect(todos).toContainEqual(newTodo);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo and save it to localStorage', async () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      const updatedTodo = await updateTodo('1', {
        title: 'Updated Title',
        completed: true,
      });

      expect(updatedTodo).toMatchObject({
        id: '1',
        title: 'Updated Title',
        completed: true,
        description: mockTodos[0].description,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const todos = await getTodos();
      const foundTodo = todos.find((todo) => todo.id === '1');
      expect(foundTodo).toMatchObject(updatedTodo as Todo);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should return null when updating non-existent todo', async () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));
      const result = await updateTodo('non-existent', {
        title: 'Updated Title',
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and save the updated list to localStorage', async () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      const result = await deleteTodo('1');
      expect(result).toBe(true);

      const todos = await getTodos();
      expect(todos).toHaveLength(1);
      expect(todos.some((todo) => todo.id === '1')).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should return false when deleting non-existent todo', async () => {
      localStorage.setItem('todos', JSON.stringify(mockTodos));
      const result = await deleteTodo('non-existent');
      expect(result).toBe(false);

      const todos = await getTodos();
      expect(todos).toHaveLength(2);
    });
  });
});
