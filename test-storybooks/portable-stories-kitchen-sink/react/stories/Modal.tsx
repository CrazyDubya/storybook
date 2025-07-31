import React, { useEffect } from 'react';
import './modal.css';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Function to close the modal
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title: string;
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Modal size
   */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Whether clicking backdrop closes modal
   */
  closeOnBackdropClick?: boolean;
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  /**
   * Modal theme
   */
  theme?: 'default' | 'dark' | 'glass';
}

/**
 * Modal component with accessibility features and multiple customization options
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  footer,
  theme = 'default',
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      const previouslyFocusedElement = document.activeElement as HTMLElement;
      
      // Focus the modal
      const modal = document.querySelector('.demo-modal__content') as HTMLElement;
      if (modal) {
        modal.focus();
      }

      // Restore focus when modal closes
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const modalClasses = [
    'demo-modal',
    `demo-modal--${size}`,
    `demo-modal--${theme}`,
  ].join(' ');

  return (
    <div 
      className="demo-modal__backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modalClasses}>
        <div 
          className="demo-modal__content" 
          tabIndex={-1}
          role="document"
        >
          <div className="demo-modal__header">
            <h2 id="modal-title" className="demo-modal__title">
              {title}
            </h2>
            {showCloseButton && (
              <button
                className="demo-modal__close"
                onClick={onClose}
                aria-label="Close modal"
                type="button"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="demo-modal__body">
            {children}
          </div>
          
          {footer && (
            <div className="demo-modal__footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};