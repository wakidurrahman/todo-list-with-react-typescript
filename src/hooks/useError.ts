/**
 * Custom hook for managing error states with timeout functionality
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { AlertVariant, ErrorAction, ErrorState } from '../types/error.types';

const ERROR_TIMEOUT = 5000;

const initialState: ErrorState = {
  message: '',
  variant: 'info',
  show: false,
  timeout: ERROR_TIMEOUT,
};

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, ...action.payload, show: true };
    case 'CLEAR_ERROR':
      return { ...state, show: false };
    default:
      return state;
  }
};

const useError = (defaultTimeout = ERROR_TIMEOUT) => {
  const [errorState, dispatch] = useReducer(errorReducer, {
    ...initialState,
    timeout: defaultTimeout,
  });

  // The timeoutRef is used to store and manage the timeout ID for the auto-dismissing error functionality.
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      // Prevent memory leaks by clearing timeout when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const setError = useCallback(
    (message: string, variant: AlertVariant = 'danger', timeout?: number) => {
      // Clear any existing timeout to prevent multiple timeouts running
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      dispatch({
        type: 'SET_ERROR',
        payload: {
          message,
          variant,
          timeout: timeout || defaultTimeout,
          show: true,
        },
      });

      // Set new timeout if not disabled
      if (timeout !== 0) {
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'CLEAR_ERROR' });
        }, timeout || defaultTimeout);
      }
    },
    [defaultTimeout]
  );

  const clearError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return {
    error: errorState,
    setError,
    clearError,
  };
};

export default useError;
