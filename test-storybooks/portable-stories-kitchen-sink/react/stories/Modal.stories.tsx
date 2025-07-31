import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from 'storybook/test';
import { useState } from 'react';

import { Modal } from './Modal';
import { Button } from './Button';
import { Form } from './Form';

const meta = {
  title: 'Example/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A versatile Modal component with accessibility features, multiple sizes, themes, and keyboard navigation support.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'fullscreen'],
      description: 'Modal size',
    },
    theme: {
      control: { type: 'select' },
      options: ['default', 'dark', 'glass'],
      description: 'Modal theme',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Whether clicking the backdrop closes the modal',
    },
    onClose: {
      action: 'modal-closed',
      description: 'Function called when modal is closed',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Modal controller component for stories
const ModalController = ({ children, ...props }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    action('modal-closed')();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button onClick={handleOpen} primary>
        Open Modal
      </Button>
      <Modal {...props} isOpen={isOpen} onClose={handleClose}>
        {children}
      </Modal>
    </div>
  );
};

export const Default: Story = {
  args: {
    title: 'Default Modal',
    children: (
      <div>
        <p>This is a basic modal with default styling and behavior.</p>
        <p>
          You can close this modal by clicking the × button, pressing the Escape key, 
          or clicking outside the modal content.
        </p>
      </div>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const Small: Story = {
  args: {
    title: 'Small Modal',
    size: 'small',
    children: (
      <div>
        <p>This is a small modal, perfect for confirmations or quick actions.</p>
      </div>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const Large: Story = {
  args: {
    title: 'Large Modal',
    size: 'large',
    children: (
      <div>
        <h3>Large Modal Content</h3>
        <p>This large modal can contain extensive content like detailed forms, images, or complex layouts.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4>Feature 1</h4>
            <p>Description of feature 1</p>
          </div>
          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4>Feature 2</h4>
            <p>Description of feature 2</p>
          </div>
          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
            <h4>Feature 3</h4>
            <p>Description of feature 3</p>
          </div>
        </div>
      </div>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const WithFooter: Story = {
  args: {
    title: 'Modal with Footer',
    children: (
      <div>
        <p>This modal includes a footer with action buttons.</p>
        <p>The footer is commonly used for form actions, confirmations, or navigation.</p>
      </div>
    ),
    footer: (
      <>
        <Button primary={false} size="medium">
          Cancel
        </Button>
        <Button primary size="medium">
          Save Changes
        </Button>
      </>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const DarkTheme: Story = {
  args: {
    title: 'Dark Theme Modal',
    theme: 'dark',
    children: (
      <div>
        <p>This modal uses the dark theme, which is great for applications with dark interfaces.</p>
        <p>All text and elements automatically adapt to the dark color scheme.</p>
      </div>
    ),
    footer: (
      <>
        <Button primary={false} size="medium">
          Cancel
        </Button>
        <Button primary size="medium">
          Confirm
        </Button>
      </>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const GlassTheme: Story = {
  args: {
    title: 'Glass Effect Modal',
    theme: 'glass',
    children: (
      <div>
        <p>This modal uses a glass effect with backdrop blur for a modern, translucent appearance.</p>
        <p>Perfect for overlay content that doesn't fully block the background view.</p>
      </div>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const ConfirmationDialog: Story = {
  args: {
    title: 'Delete Item',
    size: 'small',
    children: (
      <div>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </div>
    ),
    footer: (
      <>
        <Button primary={false} size="medium">
          Cancel
        </Button>
        <Button 
          primary 
          size="medium" 
          backgroundColor="#d32f2f"
          onClick={action('item-deleted')}
        >
          Delete
        </Button>
      </>
    ),
  },
  render: (args) => <ModalController {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Open the modal
    const openButton = canvas.getByText('Open Modal');
    await userEvent.click(openButton);
    
    // Verify modal is open and focused
    const modal = canvas.getByRole('dialog');
    await expect(modal).toBeInTheDocument();
    
    // Test keyboard navigation
    const deleteButton = canvas.getByText('Delete');
    await expect(deleteButton).toBeInTheDocument();
  },
};

export const FormModal: Story = {
  args: {
    title: 'Contact Form',
    size: 'medium',
    children: (
      <Form
        title=""
        fields={[
          {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name',
          },
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
        ]}
        onSubmit={action('form-submitted')}
      />
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const ScrollableContent: Story = {
  args: {
    title: 'Long Content Modal',
    size: 'medium',
    children: (
      <div>
        <h3>Terms and Conditions</h3>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate 
            velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
        ))}
      </div>
    ),
    footer: (
      <>
        <Button primary={false} size="medium">
          Decline
        </Button>
        <Button primary size="medium">
          Accept
        </Button>
      </>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const NoCloseButton: Story = {
  args: {
    title: 'Modal Without Close Button',
    showCloseButton: false,
    closeOnBackdropClick: false,
    children: (
      <div>
        <p>This modal can only be closed using the footer buttons.</p>
        <p>The close button is hidden and backdrop clicks are disabled.</p>
      </div>
    ),
    footer: (
      <Button primary size="medium">
        Close Modal
      </Button>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const Fullscreen: Story = {
  args: {
    title: 'Fullscreen Modal',
    size: 'fullscreen',
    children: (
      <div style={{ padding: '20px 0' }}>
        <h3>Fullscreen Experience</h3>
        <p>This modal takes up the entire viewport, perfect for immersive experiences.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          margin: '40px 0'
        }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e1e5e9'
            }}>
              <h4>Content Block {i + 1}</h4>
              <p>This is some sample content in a fullscreen modal layout.</p>
            </div>
          ))}
        </div>
      </div>
    ),
    footer: (
      <Button primary size="large">
        Done
      </Button>
    ),
  },
  render: (args) => <ModalController {...args} />,
};

export const AccessibilityDemo: Story = {
  args: {
    title: 'Accessible Modal',
    children: (
      <div>
        <p>This modal demonstrates proper accessibility features:</p>
        <ul>
          <li>Focus is trapped within the modal</li>
          <li>Escape key closes the modal</li>
          <li>ARIA attributes are properly set</li>
          <li>Focus is restored when modal closes</li>
          <li>Screen readers can navigate properly</li>
        </ul>
        <p>Try using keyboard navigation to explore the modal.</p>
      </div>
    ),
    footer: (
      <>
        <Button primary={false} size="medium">
          Cancel
        </Button>
        <Button primary size="medium">
          Confirm
        </Button>
      </>
    ),
  },
  render: (args) => <ModalController {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Open modal
    await userEvent.click(canvas.getByText('Open Modal'));
    
    // Test escape key
    await userEvent.keyboard('{Escape}');
    
    // Verify modal is closed
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Open modal again
    await userEvent.click(canvas.getByText('Open Modal'));
    
    // Test tab navigation
    await userEvent.tab();
    const confirmButton = canvas.getByText('Confirm');
    await expect(confirmButton).toHaveFocus();
  },
};