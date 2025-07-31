import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from '@storybook/addon-actions';
import { within, userEvent, expect } from 'storybook/test';
import { useState } from 'react';

import { Button } from './Button';
import { Card } from './Card';
import { Form } from './Form';
import { Modal } from './Modal';

/**
 * Comprehensive demo page showcasing all components working together
 */
const DemoPage = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    addNotification(`Selected: ${cardId}`);
    action('card-selected')(cardId);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data);
    addNotification('Form submitted successfully!');
    setShowFormModal(false);
    action('form-submitted')(data);
  };

  const demoCards = [
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Real-time analytics and insights for your business.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      featured: true,
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Powerful tools for team productivity and communication.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop',
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Enterprise-grade security features to protect your data.',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    },
    {
      id: 'automation',
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and streamline your processes.',
      imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop',
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Nunito Sans', sans-serif",
    }}>
      {/* Header */}
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '60px',
        color: 'white',
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          margin: '0 0 16px 0',
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>
          Storybook Demo
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6',
        }}>
          A comprehensive showcase of interactive UI components built with React and Storybook
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            primary 
            size="large" 
            onClick={() => setShowContactModal(true)}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
          >
            Get Started
          </Button>
          <Button 
            size="large"
            backgroundColor="rgba(255,255,255,0.2)"
            style={{ color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            onClick={() => setShowFormModal(true)}
          >
            Contact Us
          </Button>
        </div>
      </header>

      {/* Features Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 60px auto' }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: 'white', 
          fontSize: '2.5rem',
          marginBottom: '40px',
          fontWeight: '600',
        }}>
          Featured Components
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
        }}>
          {demoCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              variant={card.featured ? 'featured' : 'default'}
              elevated
              interactive
              onClick={() => handleCardSelect(card.title)}
              actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    size="small" 
                    primary
                    onClick={(e) => {
                      e.stopPropagation();
                      addNotification(`Exploring ${card.title}`);
                    }}
                  >
                    Explore
                  </Button>
                  <Button 
                    size="small" 
                    primary={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      addNotification('Added to favorites');
                    }}
                  >
                    ⭐ Save
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section style={{ 
        maxWidth: '800px', 
        margin: '0 auto 60px auto',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.2)',
      }}>
        <h3 style={{ 
          color: 'white', 
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          Interactive Demo
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', marginBottom: '12px' }}>Button Variants</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button onClick={() => addNotification('Primary action clicked!')}>
                Primary Action
              </Button>
              <Button 
                primary={false}
                onClick={() => addNotification('Secondary action clicked!')}
              >
                Secondary
              </Button>
              <Button 
                size="small"
                backgroundColor="#28a745"
                onClick={() => addNotification('Success!')}
              >
                Success
              </Button>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'white', marginBottom: '12px' }}>Modal Actions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button onClick={() => setShowContactModal(true)}>
                📞 Contact Modal
              </Button>
              <Button onClick={() => setShowFormModal(true)}>
                📝 Form Modal
              </Button>
              <Button 
                backgroundColor="#6c757d"
                onClick={() => addNotification('Feature coming soon!')}
              >
                🔧 Settings
              </Button>
            </div>
          </div>
        </div>

        {selectedCard && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            color: '#333',
          }}>
            <h4>Selected: {selectedCard}</h4>
            <p>You clicked on the {selectedCard} card. This demonstrates component interaction!</p>
            <Button 
              size="small" 
              onClick={() => setSelectedCard(null)}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </section>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {notifications.map((notification, index) => (
            <div
              key={index}
              style={{
                background: '#28a745',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '4px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                animation: 'slideIn 0.3s ease-out',
                maxWidth: '300px',
              }}
            >
              {notification}
            </div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Get Started"
        size="medium"
        footer={
          <>
            <Button 
              primary={false} 
              onClick={() => setShowContactModal(false)}
            >
              Maybe Later
            </Button>
            <Button 
              primary
              onClick={() => {
                addNotification('Welcome aboard! 🎉');
                setShowContactModal(false);
              }}
            >
              Start Free Trial
            </Button>
          </>
        }
      >
        <div>
          <h3>Ready to get started?</h3>
          <p>Join thousands of teams already using our platform to build amazing products.</p>
          
          <div style={{ margin: '24px 0' }}>
            <h4>What you'll get:</h4>
            <ul>
              <li>✅ Full access to all features</li>
              <li>✅ 30-day free trial</li>
              <li>✅ Priority support</li>
              <li>✅ No setup fees</li>
            </ul>
          </div>
          
          <Card
            title="Special Offer"
            description="Get 50% off your first year when you sign up today!"
            variant="featured"
            actions={
              <Button size="small" backgroundColor="#ff6b35">
                Claim Offer
              </Button>
            }
          />
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Contact Us"
        size="large"
      >
        <Form
          title=""
          fields={[
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
              placeholder: 'your@email.com',
              validation: (email: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email) ? null : 'Please enter a valid email';
              },
            },
            {
              name: 'company',
              label: 'Company',
              type: 'text',
              placeholder: 'Your company name',
            },
            {
              name: 'interest',
              label: 'What interests you most?',
              type: 'select',
              required: true,
              options: [
                { value: 'features', label: 'Product Features' },
                { value: 'pricing', label: 'Pricing Information' },
                { value: 'demo', label: 'Schedule a Demo' },
                { value: 'support', label: 'Technical Support' },
                { value: 'partnership', label: 'Partnership Opportunities' },
              ],
            },
            {
              name: 'message',
              label: 'Message',
              type: 'textarea',
              required: true,
              placeholder: 'Tell us more about your needs...',
            },
            {
              name: 'newsletter',
              label: 'Subscribe to our newsletter for updates',
              type: 'checkbox',
            },
          ]}
          onSubmit={handleFormSubmit}
          theme="modern"
        />
      </Modal>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const meta = {
  title: 'Demo/Complete Showcase',
  component: DemoPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Complete Storybook Demo

This is a comprehensive demonstration of all the UI components working together in a realistic application scenario. The demo showcases:

## Components Featured:
- **Buttons** - Various sizes, themes, and interactive states
- **Cards** - Different layouts, interactive features, and content types  
- **Forms** - Dynamic field types, validation, and submission handling
- **Modals** - Multiple sizes, themes, and accessibility features

## Features Demonstrated:
- **Component Composition** - How components work together
- **State Management** - Interactive state between components
- **Event Handling** - User interactions and callbacks
- **Responsive Design** - Adapts to different screen sizes
- **Accessibility** - Keyboard navigation and screen reader support
- **Theming** - Consistent design system across components
- **Real-world Scenarios** - Practical use cases and workflows

## Interaction Testing:
- Click on cards to see selection feedback
- Use buttons to trigger notifications
- Open modals with different content types
- Submit forms with validation
- Test keyboard navigation throughout
        `,
      },
    },
  },
} satisfies Meta<typeof DemoPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test the main call-to-action button
    const getStartedButton = canvas.getByText('Get Started');
    await expect(getStartedButton).toBeInTheDocument();
    
    // Click to open modal
    await userEvent.click(getStartedButton);
    
    // Verify modal opened
    const modal = canvas.getByRole('dialog');
    await expect(modal).toBeInTheDocument();
    
    // Close modal
    const closeButton = canvas.getByLabelText('Close modal');
    await userEvent.click(closeButton);
    
    // Test card interaction
    const firstCard = canvas.getByText('Analytics Dashboard');
    await userEvent.click(firstCard);
    
    // Verify card selection feedback
    const selection = canvas.getByText(/Selected: Analytics Dashboard/);
    await expect(selection).toBeInTheDocument();
  },
};