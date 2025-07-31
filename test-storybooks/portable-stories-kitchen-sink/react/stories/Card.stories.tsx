import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from 'storybook/test';

import { Card } from './Card';
import { Button } from './Button';

const meta = {
  title: 'Example/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile Card component that can display content in various layouts and styles. Supports different variants, interactivity, and customizable actions.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the card',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    imageUrl: {
      control: 'text',
      description: 'URL for the card image',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'featured', 'minimal'],
      description: 'Visual variant of the card',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether the card has elevation shadow',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card responds to hover and click',
    },
    onClick: {
      action: 'card-clicked',
      description: 'Click handler for the card',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Card',
    description: 'This is a basic card with default styling and no special features.',
  },
};

export const WithImage: Story = {
  args: {
    title: 'Card with Image',
    description: 'This card includes a beautiful header image to make it more visually appealing.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    elevated: true,
  },
};

export const Featured: Story = {
  args: {
    title: 'Featured Card',
    description: 'This is a featured card with special styling to draw attention.',
    variant: 'featured',
    elevated: true,
  },
};

export const Interactive: Story = {
  args: {
    title: 'Interactive Card',
    description: 'Click me! This card responds to user interaction with hover effects.',
    interactive: true,
    elevated: true,
    onClick: action('card-clicked'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    
    // Test hover interaction
    await userEvent.hover(card);
    
    // Test click interaction
    await userEvent.click(card);
  },
};

export const WithActions: Story = {
  args: {
    title: 'Card with Actions',
    description: 'This card includes action buttons in the footer area.',
    elevated: true,
    actions: (
      <>
        <Button size="small" onClick={action('primary-action')}>
          Primary
        </Button>
        <Button size="small" primary={false} onClick={action('secondary-action')}>
          Secondary
        </Button>
      </>
    ),
  },
};

export const CustomContent: Story = {
  args: {
    title: 'Custom Content Card',
    description: 'This card demonstrates custom content in the body area.',
    variant: 'featured',
    elevated: true,
    children: (
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: '#1ea7fd' }}>Features:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Customizable content area</li>
          <li>Flexible layout options</li>
          <li>Theme-aware styling</li>
        </ul>
      </div>
    ),
    actions: (
      <Button size="medium" primary onClick={action('learn-more')}>
        Learn More
      </Button>
    ),
  },
};

export const Gallery: Story = {
  parameters: {
    layout: 'padded',
  },
  decorators: [
    () => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
        <Card
          title="Nature Photography"
          description="Stunning landscape photography from around the world."
          imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
          variant="default"
          elevated
          interactive
          onClick={action('nature-card-clicked')}
        />
        <Card
          title="Technology News"
          description="Latest updates from the world of technology and innovation."
          variant="featured"
          elevated
          actions={
            <Button size="small" primary onClick={action('read-more')}>
              Read More
            </Button>
          }
        />
        <Card
          title="Minimal Design"
          description="Clean and simple design approach for modern applications."
          variant="minimal"
        />
        <Card
          title="Interactive Demo"
          description="This card showcases interactive features and smooth animations."
          imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
          interactive
          elevated
          onClick={action('demo-card-clicked')}
          actions={
            <>
              <Button size="small" onClick={action('try-now')}>
                Try Now
              </Button>
              <Button size="small" primary={false} onClick={action('learn-more')}>
                Learn More
              </Button>
            </>
          }
        />
      </div>
    ),
  ],
  render: () => null,
};

// Test different states
export const Loading: Story = {
  args: {
    title: 'Loading Card',
    description: 'This card simulates a loading state.',
    children: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #1ea7fd',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span>Loading content...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    ),
    elevated: true,
  },
};

export const Error: Story = {
  args: {
    title: 'Error State',
    description: 'This card demonstrates an error state with appropriate styling.',
    children: (
      <div style={{ color: '#d32f2f', padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
        ⚠️ Something went wrong. Please try again.
      </div>
    ),
    actions: (
      <Button size="small" onClick={action('retry')}>
        Retry
      </Button>
    ),
  },
};

export const Accessibility: Story = {
  args: {
    title: 'Accessible Card',
    description: 'This card demonstrates proper accessibility features including ARIA labels and keyboard navigation.',
    interactive: true,
    elevated: true,
    onClick: action('accessible-card-clicked'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button');
    
    // Test keyboard navigation
    card.focus();
    await expect(card).toHaveFocus();
    
    // Test Enter key activation
    await userEvent.keyboard('{Enter}');
    
    // Test Space key activation
    await userEvent.keyboard(' ');
  },
};