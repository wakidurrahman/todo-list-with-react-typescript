import { sanitizeInput, validateTodoForm } from './validation';

describe('validation utilities', () => {
  describe('sanitizeInput', () => {
    it('removes HTML tags and trims input', () => {
      expect(sanitizeInput('<script>alert("xss")</script> text')).toBe('text');
      expect(sanitizeInput('<p>text</p>')).toBe('text');
      expect(sanitizeInput('  text  ')).toBe('text');
    });

    it('handles various malicious inputs', () => {
      expect(sanitizeInput('javascript:alert("xss")')).toBe('');
      expect(sanitizeInput('<img src="x" onerror="alert(1)">')).toBe('');
      expect(sanitizeInput('Hello <script>alert(1)</script> World')).toBe(
        'Hello World'
      );
    });

    it('preserves valid text content', () => {
      expect(sanitizeInput('Hello, World!')).toBe('Hello, World!');
      expect(sanitizeInput("User's Input 123")).toBe("User's Input 123");
      expect(sanitizeInput('Multiple     Spaces')).toBe('Multiple Spaces');
    });

    it('handles empty and whitespace input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
      expect(sanitizeInput('\n\t  \r')).toBe('');
    });
  });

  describe('validateTodoForm', () => {
    it('validates required fields', () => {
      const errors = validateTodoForm({ title: '', description: '' });
      expect(errors.title).toBe('Title is required');
      expect(errors.description).toBe('Description is required');
    });

    it('validates title length', () => {
      const errors = validateTodoForm({
        title: 'ab',
        description: 'Valid description that is long enough',
      });
      expect(errors.title).toBe('Title must be at least 3 characters');
    });

    it('validates description length', () => {
      const errors = validateTodoForm({
        title: 'Valid Title',
        description: 'short',
      });
      expect(errors.description).toBe(
        'Description must be at least 10 characters'
      );
    });

    it('returns no errors for valid data', () => {
      const errors = validateTodoForm({
        title: 'Valid Title',
        description: 'Valid description that is long enough',
      });
      expect(errors).toEqual({});
    });

    it('handles sanitized input in validation', () => {
      const errors = validateTodoForm({
        title: '<script>alert("xss")</script>Valid Title',
        description: '<p>Valid description that is long enough</p>',
      });
      expect(errors).toEqual({}); // Should pass after sanitization
    });
  });
});
