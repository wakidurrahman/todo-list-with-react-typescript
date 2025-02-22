import '@testing-library/jest-dom';

type LocalStorageMock = {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: jest.Mock;
};

const localStorageMock: LocalStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
