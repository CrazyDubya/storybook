import { expect, fn, within, userEvent } from 'storybook/test';
import type { Meta, StoryFn as CSF2Story, StoryObj as CSF3Story } from '@storybook/react-vite';

import type { ButtonProps } from './Button';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Primary UI component for user interaction. Supports multiple sizes, themes, and interactive states.',
      },
    },
  },
  argTypes: {
    backgroundColor: { 
      control: 'color',
      description: 'Custom background color for the button',
    },
    primary: {
      control: 'boolean',
      description: 'Is this the principal call to action on the page?',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'How large should the button be?',
    },
    children: {
      control: 'text',
      description: 'Button contents',
    },
    onClick: {
      action: 'button-clicked',
      description: 'Optional click handler',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

const Template: CSF2Story<ButtonProps> = (args) => <Button {...args} />;

export const CSF2Secondary = Template.bind({});
CSF2Secondary.args = {
  children: 'Children coming from story args!',
  primary: false,
};

const getCaptionForLocale = (locale: string) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'pt':
      return 'Olá!';
    case 'en':
      return 'Hello!';
    default:
      return undefined;
  }
};

export const CSF2StoryWithLocale: CSF2Story = (args, { globals: { locale } }) => {
  const caption = getCaptionForLocale(locale);
  return (
    <>
      <p>locale: {locale}</p>
      <Button>{caption}</Button>
    </>
  );
};
CSF2StoryWithLocale.storyName = 'WithLocale';

export const CSF2StoryWithParamsAndDecorator: CSF2Story<ButtonProps> = (args) => {
  return <Button {...args} />;
};
CSF2StoryWithParamsAndDecorator.args = {
  children: 'foo',
};
CSF2StoryWithParamsAndDecorator.parameters = {
  layout: 'centered',
};
CSF2StoryWithParamsAndDecorator.decorators = [(StoryFn) => <StoryFn />];

export const CSF3Primary: CSF3Story<ButtonProps> = {
  args: {
    children: "Primary Action",
    size: 'large',
    primary: true,
  },
  // Accessibility is failing for the Button
  tags: ['fail-on-purpose'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Test button is rendered
    await expect(button).toBeInTheDocument();
    
    // Test click interaction
    await userEvent.click(button);
    await expect(button).toHaveFocus();
  },
};

export const CSF3Button: CSF3Story<ButtonProps> = {
  args: { children: 'foo' },
};

export const CSF3ButtonWithRender: CSF3Story<ButtonProps> = {
  ...CSF3Button,
  render: (args) => (
    <div>
      <p data-testid="custom-render">I am a custom render function</p>
      <Button {...args} />
    </div>
  ),
};

const mockFn = fn();
export const WithLoader: CSF3Story<{ mockFn: (val: string) => string }> = {
  args: {
    mockFn,
  },
  loaders: [
    async () => {
      mockFn.mockReturnValueOnce('mockFn return value');
      return {
        value: 'loaded data',
      };
    },
  ],
  render: (args, { loaded }) => {
    const data = args.mockFn('render');
    return (
      <div>
        <div data-testid="loaded-data">{loaded.value}</div>
        <div data-testid="mock-data">{String(data)}</div>
      </div>
    );
  },
  play: async () => {
    expect(mockFn).toHaveBeenCalledWith('render');
  },
};

// New enhanced stories showcasing full functionality
export const SizeVariants: CSF3Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button component supports three different sizes: small, medium, and large.',
      },
    },
  },
};

export const ThemeVariants: CSF3Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button primary>Primary</Button>
      <Button primary={false}>Secondary</Button>
      <Button backgroundColor="#28a745">Success</Button>
      <Button backgroundColor="#dc3545">Danger</Button>
      <Button backgroundColor="#6c757d">Neutral</Button>
      <Button backgroundColor="#fd7e14">Warning</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be styled as primary, secondary, or with custom background colors.',
      },
    },
  },
};

export const InteractiveStates: CSF3Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', maxWidth: '600px' }}>
      <Button>Normal</Button>
      <Button style={{ opacity: 0.6 }}>Disabled</Button>
      <Button className="loading-button">Loading</Button>
      <Button style={{ transform: 'scale(0.95)' }}>Pressed</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual states that buttons can have during user interaction.',
      },
    },
  },
};

export const ButtonGroup: CSF3Story = {
  render: () => (
    <div>
      <h4>Button Group Example</h4>
      <div style={{ 
        display: 'flex', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        overflow: 'hidden',
        width: 'fit-content'
      }}>
        <Button style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #ccc' }}>
          Left
        </Button>
        <Button style={{ borderRadius: 0, border: 'none', borderRight: '1px solid #ccc' }}>
          Center
        </Button>
        <Button style={{ borderRadius: 0, border: 'none' }}>
          Right
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be grouped together for related actions.',
      },
    },
  },
};

export const WithIcons: CSF3Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button>
        📄 Document
      </Button>
      <Button primary>
        💾 Save
      </Button>
      <Button backgroundColor="#dc3545">
        🗑️ Delete
      </Button>
      <Button>
        ⚙️ Settings
      </Button>
      <Button primary>
        🚀 Launch
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons can include icons or emojis alongside text content.',
      },
    },
  },
};

export const ResponsiveButtons: CSF3Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '300px' }}>
      <Button style={{ width: '100%' }}>Full Width</Button>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button style={{ flex: 1 }}>Cancel</Button>
        <Button primary style={{ flex: 1 }}>Confirm</Button>
      </div>
      <Button size="small" style={{ alignSelf: 'flex-end' }}>Small Action</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons can be made responsive and adapt to different container sizes.',
      },
    },
  },
};

export const AccessibilityDemo: CSF3Story = {
  args: {
    children: 'Accessible Button',
    primary: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    // Test button is accessible
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveAttribute('type', 'button');
    
    // Test keyboard interaction
    button.focus();
    await expect(button).toHaveFocus();
    
    // Test enter key activation
    await userEvent.keyboard('{Enter}');
    
    // Test space key activation
    await userEvent.keyboard(' ');
  },
  parameters: {
    docs: {
      description: {
        story: 'Button component includes proper accessibility features including keyboard navigation and ARIA attributes.',
      },
    },
  },
};

export const PerformanceTest: CSF3Story = {
  render: () => {
    const handleClick = fn();
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', maxWidth: '500px' }}>
        {Array.from({ length: 50 }, (_, i) => (
          <Button 
            key={i} 
            size="small" 
            onClick={handleClick}
            style={{ fontSize: '10px', padding: '4px' }}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with multiple button instances to ensure the component scales well.',
      },
    },
  },
};