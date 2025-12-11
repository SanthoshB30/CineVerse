import React from 'react';

/**
 * Reusable Card Component with glassmorphism effect
 * Base card component for consistent styling across the app
 */

const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  onClick,
  ...props
}) => {
  const baseClass = 'card';
  const variantClass = variant !== 'default' ? `card-${variant}` : '';
  const hoverClass = hoverable ? 'card-hoverable' : '';
  
  const classes = [
    baseClass,
    variantClass,
    hoverClass,
    className
  ].filter(Boolean).join(' ');

  const CardComponent = onClick ? 'button' : 'div';

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

export default Card;

