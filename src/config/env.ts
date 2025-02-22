/**
 * Environment configuration
 *
 * This module provides a type-safe way to access environment variables
 * and makes it easier to mock them in tests.
 */

type EnvConfig = {
  USE_API: boolean;
};

export const getEnvConfig = (): EnvConfig => {
  if (import.meta.env.MODE === 'test') {
    return {
      USE_API: false, // Default to false in test environment
    };
  }

  return {
    USE_API: import.meta.env.VITE_USE_API === 'true',
  };
};

export const env = getEnvConfig();
