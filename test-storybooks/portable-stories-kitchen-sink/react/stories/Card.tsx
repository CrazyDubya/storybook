import React from 'react';
import './card.css';

export interface CardProps {
  /**
   * Card title
   */
  title: string;
  /**
   * Card description
   */
  description?: string;
  /**
   * Card image URL
   */
  imageUrl?: string;
  /**
   * Card variant
   */
  variant?: 'default' | 'featured' | 'minimal';
  /**
   * Whether the card is elevated
   */
  elevated?: boolean;
  /**
   * Whether the card is interactive
   */
  interactive?: boolean;
  /**
   * Card actions
   */
  actions?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional content
   */
  children?: React.ReactNode;
}

/**
 * Versatile Card component for displaying content
 */
export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  variant = 'default',
  elevated = false,
  interactive = false,
  actions,
  onClick,
  children,
}) => {
  const cardClasses = [
    'demo-card',
    `demo-card--${variant}`,
    elevated && 'demo-card--elevated',
    interactive && 'demo-card--interactive',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined}>
      {imageUrl && (
        <div className="demo-card__image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <div className="demo-card__content">
        <h3 className="demo-card__title">{title}</h3>
        {description && <p className="demo-card__description">{description}</p>}
        {children && <div className="demo-card__body">{children}</div>}
        {actions && <div className="demo-card__actions">{actions}</div>}
      </div>
    </div>
  );
};