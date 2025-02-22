import { TodoFormData } from '../types/todo.types';

/**
 * Type representing validation errors for todo form fields.
 * Uses Partial<Record> to make all fields optional and derive keys from TodoFormData.
 */
export type ValidationErrors = Partial<Record<keyof TodoFormData, string>>;

// Sanitize input by removing HTML tags, scripts, and trimming
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:|script:|alert\(.*\)/gi, '') // Remove potential JavaScript
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

// Validate form data
export const validateTodoForm = (data: TodoFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title) {
    errors.title = 'Title is required';
  } else {
    const sanitizedTitle = sanitizeInput(data.title);
    if (sanitizedTitle.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (sanitizedTitle.length > 40) {
      errors.title = 'Title must not exceed 40 characters';
    }
  }

  // Description validation
  if (!data.description) {
    errors.description = 'Description is required';
  } else {
    const sanitizedDesc = sanitizeInput(data.description);
    if (sanitizedDesc.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (sanitizedDesc.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }
  }

  return errors;
};
