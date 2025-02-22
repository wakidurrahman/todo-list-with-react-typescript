/**
 * TodoForm Component
 *
 * A form component for creating and editing todo items with:
 * - Title and description fields with validation
 * - Real-time validation with Bootstrap styles and feedback
 * - Create and edit modes with state management
 * - Cancel functionality for edit mode
 * - Accessibility features (ARIA labels)
 * - Input sanitization
 * - Bootstrap responsive layout
 * - Form validation and error handling
 *
 * @param {Object} props - Component props
 * @param {function} props.onSubmit - Callback when form is submitted with valid data
 * @param {Todo} [props.editingTodo] - Todo data for edit mode
 * @param {function} [props.onCancel] - Optional callback for cancel button
 */

import { useEffect, useState } from 'react';

import Button from '@/components/atoms/button/Button';
import { Todo, TodoFormData } from '@/types/todo.types';
import {
  ValidationErrors,
  sanitizeInput,
  validateTodoForm,
} from '@/utils/validation';

type TodoFormProps = {
  onSubmit: (data: TodoFormData) => void;
  editingTodo?: Todo;
  onCancel?: () => void;
};

// Initial form state
const INITIAL_FORM_STATE: TodoFormData = {
  title: '',
  description: '',
} as const;

const TodoForm = ({ onSubmit, editingTodo, onCancel }: TodoFormProps) => {
  const [formData, setFormData] = useState<TodoFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!editingTodo) return;

    setFormData({
      title: editingTodo.title || '',
      description: editingTodo.description || '',
    });

    setTouched({
      title: true,
      description: true,
    });

    setErrors({});
  }, [editingTodo]);

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      title: true,
      description: true,
    });

    const sanitizedData = {
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
    };

    const validationErrors = validateTodoForm(sanitizedData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(sanitizedData);
      handleResetForm();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (editingTodo || touched[name]) {
      const sanitizedValue = sanitizeInput(value);
      const fieldErrors = validateTodoForm({
        ...formData,
        [name]: sanitizedValue,
      });
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof ValidationErrors],
      }));
    }
  };

  const handleCancel = () => {
    handleResetForm();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          placeholder="Enter title"
          className={`form-control ${
            touched.title ? (errors.title ? 'is-invalid' : 'is-valid') : ''
          }`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={50}
          aria-describedby="titleFeedback"
          aria-label="Todo title"
          tabIndex={0}
        />
        {touched.title && errors.title && (
          <div id="titleFeedback" className="invalid-feedback">
            {errors.title || 'Please provide a valid title.'}
          </div>
        )}
        {touched.title && !errors.title && (
          <div className="valid-feedback">Looks good!</div>
        )}
      </div>

      <div className="col-12">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          placeholder="Enter description"
          className={`form-control ${
            touched.description
              ? errors.description
                ? 'is-invalid'
                : 'is-valid'
              : ''
          }`}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          aria-describedby="descriptionFeedback"
          aria-label="Todo description"
          tabIndex={0}
        />
        {touched.description && errors.description && (
          <div id="descriptionFeedback" className="invalid-feedback">
            {errors.description || 'Please provide a valid description.'}
          </div>
        )}
        {touched.description && !errors.description && (
          <div className="valid-feedback">Looks good!</div>
        )}
      </div>

      <div className="col-12 d-flex justify-content-center gap-2">
        <Button
          type="submit"
          variant="primary"
          aria-label={`${editingTodo ? 'Update' : 'Add'} todo`}
        >
          {editingTodo ? 'Update' : 'Add'} Todo
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
