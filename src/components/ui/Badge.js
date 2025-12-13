import React from 'react';

/**
 * Reusable Badge Component
 * For labels, tags, and status indicators
 */

const Badge = ({
  children,
  variant = 'default',
  size = 'base',
  className = '',
  ...props
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = size !== 'base' ? `badge-${size}` : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;

