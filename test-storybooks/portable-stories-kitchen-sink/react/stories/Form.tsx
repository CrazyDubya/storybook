import React, { useState } from 'react';
import './form.css';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
}

export interface FormProps {
  /**
   * Form title
   */
  title: string;
  /**
   * Form fields configuration
   */
  fields: FormField[];
  /**
   * Form submission handler
   */
  onSubmit: (data: Record<string, any>) => void;
  /**
   * Form layout
   */
  layout?: 'vertical' | 'horizontal';
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Form theme
   */
  theme?: 'default' | 'modern' | 'minimal';
}

/**
 * Dynamic Form component with validation and multiple field types
 */
export const Form: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  layout = 'vertical',
  loading = false,
  theme = 'default',
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const validateField = (name: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) return;

    const value = formData[name];
    let error = '';

    // Required validation
    if (field.required && (!value || value.toString().trim() === '')) {
      error = `${field.label} is required`;
    }

    // Custom validation
    if (!error && field.validation && value) {
      const customError = field.validation(value);
      if (customError) error = customError;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    
    if (isValid) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = touched[field.name] && errors[field.name];
    const fieldId = `field-${field.name}`;

    switch (field.type) {
      case 'select':
        return (
          <select
            id={fieldId}
            value={value}
            onChange={e => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            className={`demo-form__field ${error ? 'demo-form__field--error' : ''}`}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={e => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            className={`demo-form__field ${error ? 'demo-form__field--error' : ''}`}
            required={field.required}
            rows={4}
          />
        );
      
      case 'checkbox':
        return (
          <div className="demo-form__checkbox">
            <input
              id={fieldId}
              type="checkbox"
              checked={!!value}
              onChange={e => handleFieldChange(field.name, e.target.checked)}
              onBlur={() => handleFieldBlur(field.name)}
              required={field.required}
            />
            <label htmlFor={fieldId}>{field.label}</label>
          </div>
        );
      
      default:
        return (
          <input
            id={fieldId}
            type={field.type}
            value={value}
            onChange={e => handleFieldChange(field.name, e.target.value)}
            onBlur={() => handleFieldBlur(field.name)}
            placeholder={field.placeholder}
            className={`demo-form__field ${error ? 'demo-form__field--error' : ''}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <form 
      className={`demo-form demo-form--${layout} demo-form--${theme}`}
      onSubmit={handleSubmit}
    >
      <h2 className="demo-form__title">{title}</h2>
      
      {fields.map(field => (
        <div key={field.name} className="demo-form__group">
          {field.type !== 'checkbox' && (
            <label htmlFor={`field-${field.name}`} className="demo-form__label">
              {field.label}
              {field.required && <span className="demo-form__required">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {touched[field.name] && errors[field.name] && (
            <span className="demo-form__error">{errors[field.name]}</span>
          )}
        </div>
      ))}
      
      <button 
        type="submit" 
        className="demo-form__submit"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};