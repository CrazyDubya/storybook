import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from 'storybook/test';

import { Form } from './Form';

const meta = {
  title: 'Example/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dynamic Form component that supports multiple field types, validation, and different layouts. Perfect for building complex forms with a consistent design system.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The form title',
    },
    layout: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Form layout orientation',
    },
    theme: {
      control: { type: 'select' },
      options: ['default', 'modern', 'minimal'],
      description: 'Visual theme of the form',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the form is in loading state',
    },
    onSubmit: {
      action: 'form-submitted',
      description: 'Form submission handler',
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

// Email validation helper
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Please enter a valid email address';
};

// Password validation helper
const validatePassword = (password: string) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};

export const ContactForm: Story = {
  args: {
    title: 'Contact Us',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name',
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email',
        validation: validateEmail,
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'select',
        required: true,
        options: [
          { value: 'general', label: 'General Inquiry' },
          { value: 'support', label: 'Support Request' },
          { value: 'sales', label: 'Sales Question' },
          { value: 'feedback', label: 'Feedback' },
        ],
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Enter your message...',
      },
      {
        name: 'newsletter',
        label: 'Subscribe to newsletter',
        type: 'checkbox',
      },
    ],
    onSubmit: action('contact-form-submitted'),
  },
};

export const RegistrationForm: Story = {
  args: {
    title: 'Create Account',
    theme: 'modern',
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Choose a username',
        validation: (value: string) => {
          if (value.length < 3) return 'Username must be at least 3 characters';
          if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
          return null;
        },
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Enter your email',
        validation: validateEmail,
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Create a password',
        validation: validatePassword,
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        required: true,
        placeholder: 'Confirm your password',
        validation: (value: string, formData: any) => {
          return value !== formData?.password ? 'Passwords do not match' : null;
        },
      },
      {
        name: 'terms',
        label: 'I agree to the terms and conditions',
        type: 'checkbox',
        required: true,
      },
    ],
    onSubmit: action('registration-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Fill out the form
    await userEvent.type(canvas.getByPlaceholderText('Choose a username'), 'testuser123');
    await userEvent.type(canvas.getByPlaceholderText('Enter your email'), 'test@example.com');
    await userEvent.type(canvas.getByPlaceholderText('Create a password'), 'Password123');
    await userEvent.type(canvas.getByPlaceholderText('Confirm your password'), 'Password123');
    
    // Check the terms checkbox
    await userEvent.click(canvas.getByLabelText('I agree to the terms and conditions'));
    
    // Verify form is filled
    await expect(canvas.getByDisplayValue('testuser123')).toBeInTheDocument();
    await expect(canvas.getByDisplayValue('test@example.com')).toBeInTheDocument();
  },
};

export const ProfileForm: Story = {
  args: {
    title: 'Edit Profile',
    layout: 'horizontal',
    theme: 'minimal',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'First name',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Last name',
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'textarea',
        placeholder: 'Tell us about yourself...',
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        name: 'notifications',
        label: 'Enable email notifications',
        type: 'checkbox',
      },
    ],
    onSubmit: action('profile-form-submitted'),
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Processing Form',
    loading: true,
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Enter your email',
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Enter your message',
      },
    ],
    onSubmit: action('loading-form-submitted'),
  },
};

export const ValidationDemo: Story = {
  args: {
    title: 'Validation Demo',
    theme: 'modern',
    fields: [
      {
        name: 'email',
        label: 'Email (with validation)',
        type: 'email',
        required: true,
        placeholder: 'test@example.com',
        validation: validateEmail,
      },
      {
        name: 'age',
        label: 'Age (18-99)',
        type: 'text',
        required: true,
        placeholder: 'Enter your age',
        validation: (value: string) => {
          const age = parseInt(value);
          if (isNaN(age)) return 'Age must be a number';
          if (age < 18 || age > 99) return 'Age must be between 18 and 99';
          return null;
        },
      },
      {
        name: 'website',
        label: 'Website (optional URL validation)',
        type: 'text',
        placeholder: 'https://example.com',
        validation: (value: string) => {
          if (!value) return null; // Optional field
          try {
            new URL(value);
            return null;
          } catch {
            return 'Please enter a valid URL';
          }
        },
      },
    ],
    onSubmit: action('validation-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test invalid email
    const emailField = canvas.getByPlaceholderText('test@example.com');
    await userEvent.type(emailField, 'invalid-email');
    await userEvent.tab(); // Trigger blur event
    
    // Test invalid age
    const ageField = canvas.getByPlaceholderText('Enter your age');
    await userEvent.type(ageField, '15');
    await userEvent.tab();
    
    // Test invalid URL
    const websiteField = canvas.getByPlaceholderText('https://example.com');
    await userEvent.type(websiteField, 'not-a-url');
    await userEvent.tab();
    
    // Verify validation errors are shown
    await expect(canvas.getByText('Please enter a valid email address')).toBeInTheDocument();
    await expect(canvas.getByText('Age must be between 18 and 99')).toBeInTheDocument();
    await expect(canvas.getByText('Please enter a valid URL')).toBeInTheDocument();
  },
};

export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Form',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your name',
      },
      {
        name: 'preferences',
        label: 'Communication Preference',
        type: 'select',
        required: true,
        options: [
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'text', label: 'Text Message' },
        ],
      },
      {
        name: 'terms',
        label: 'I have read and agree to the terms of service',
        type: 'checkbox',
        required: true,
      },
    ],
    onSubmit: action('accessible-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test keyboard navigation
    const nameField = canvas.getByLabelText('Name *');
    nameField.focus();
    await expect(nameField).toHaveFocus();
    
    // Navigate with Tab
    await userEvent.tab();
    const selectField = canvas.getByLabelText('Communication Preference *');
    await expect(selectField).toHaveFocus();
    
    // Navigate to checkbox
    await userEvent.tab();
    const checkbox = canvas.getByLabelText('I have read and agree to the terms of service *');
    await expect(checkbox).toHaveFocus();
    
    // Activate checkbox with Space
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};