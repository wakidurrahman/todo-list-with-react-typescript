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
import InputField from '@/components/atoms/input-field/InputField';
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
        <InputField
          id="title"
          type="text"
          placeholder="Enter title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          maxLength={50}
          touched={touched.title}
          error={errors.title}
          isValid={touched.title && !errors.title}
          aria-describedby="titleFeedback"
          aria-label="Todo title"
          required
          tabIndex={0}
        />
      </div>
      <div className="col-12">
        <InputField
          tagName="textarea"
          id="description"
          placeholder="Enter description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          touched={touched.description}
          error={errors.description}
          isValid={touched.description && !errors.description}
          aria-describedby="descriptionFeedback"
          aria-label="Todo description"
          tabIndex={0}
        />
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
