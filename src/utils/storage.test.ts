import { Todo } from '../types/todo.types';

import {
  addTodo,
  deleteTodoInAPI as deleteTodo,
  getTodos,
  saveTodos,
  updateTodoInAPI as updateTodo,
} from './storage';

// Mock the environment configuration
jest.mock('../config/env', () => ({
  env: {
    USE_API: false,
  },
}));

// Mock the todoApi functions
jest.mock('../services/todoApi', () => ({
  fetchTodos: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

describe('Storage utility functions', () => {
  // Setup localStorage mock
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  // Mock crypto.randomUUID
  beforeAll(() => {
    global.crypto = {
      randomUUID: jest.fn(() => 'test-uuid'),
      subtle: {} as SubtleCrypto,
      getRandomValues: jest.fn(),
    } as unknown as Crypto;
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

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
    // Clear and initialize localStorage
    localStorageMock.clear();
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getTodos', () => {
    it('should retrieve todos from localStorage when not using API', async () => {
      localStorageMock.setItem('todos', JSON.stringify(mockTodos));
      const todos = await getTodos();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
      expect(todos).toEqual(mockTodos);
    });

    it('should return an empty array if no todos in localStorage when not using API', async () => {
      const todos = await getTodos();
      expect(todos).toEqual([]);
    });

    it('should throw error if localStorage read fails', async () => {
      jest.spyOn(localStorageMock, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      await expect(getTodos()).rejects.toThrow(
        'Failed to read todos from localStorage'
      );
    });
  });

  describe('saveTodos', () => {
    it('should save todos to localStorage when not using API', () => {
      saveTodos(mockTodos);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'todos',
        JSON.stringify(mockTodos)
      );
    });

    it('should throw error if localStorage write fails', () => {
      jest.spyOn(localStorageMock, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(() => {
        saveTodos(mockTodos);
      }).toThrow('Failed to save todos to localStorage');
    });
  });

  describe('addTodo', () => {
    it('should add a new todo to localStorage when not using API', async () => {
      // Setup initial empty todos array
      localStorageMock.setItem('todos', JSON.stringify([]));

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

      const savedTodos = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(savedTodos).toContainEqual(newTodo);
    });

    it('should handle adding todo with minimal required fields', async () => {
      // Setup initial empty todos array
      localStorageMock.setItem('todos', JSON.stringify([]));

      const minimalTodoData = {
        title: 'Minimal Todo',
        description: '',
        completed: false,
      };

      const newTodo = await addTodo(minimalTodoData);

      expect(newTodo).toMatchObject({
        ...minimalTodoData,
        id: 'test-uuid',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const savedTodos = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(savedTodos).toContainEqual(newTodo);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo in localStorage when not using API', async () => {
      localStorageMock.setItem('todos', JSON.stringify(mockTodos));

      const updatedTodo = await updateTodo('1', {
        title: 'Updated Title',
        completed: true,
      });

      expect(updatedTodo).toMatchObject({
        id: '1',
        title: 'Updated Title',
        completed: true,
        description: mockTodos[0].description,
        updatedAt: expect.any(Date),
      });

      const savedTodos = JSON.parse(localStorageMock.getItem('todos') || '[]');
      const foundTodo = savedTodos.find((todo: Todo) => todo.id === '1');
      expect(foundTodo).toMatchObject(updatedTodo as Todo);
    });

    it('should return null when updating non-existent todo', async () => {
      localStorageMock.setItem('todos', JSON.stringify(mockTodos));
      const result = await updateTodo('non-existent', {
        title: 'Updated Title',
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo from localStorage when not using API', async () => {
      localStorageMock.setItem('todos', JSON.stringify(mockTodos));

      const result = await deleteTodo('1');
      expect(result).toBe(true);

      const savedTodos = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(savedTodos).toHaveLength(1);
      expect(savedTodos.some((todo: Todo) => todo.id === '1')).toBe(false);
    });

    it('should return false when deleting non-existent todo', async () => {
      localStorageMock.setItem('todos', JSON.stringify(mockTodos));
      const result = await deleteTodo('non-existent');
      expect(result).toBe(false);

      const savedTodos = JSON.parse(localStorageMock.getItem('todos') || '[]');
      expect(savedTodos).toHaveLength(2);
    });
  });
});
