import React from 'react';

/**
 * Reusable Button Component with variants
 * Supports primary, secondary, outline, and size variations
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'base' ? `btn-${size}` : '';
  const disabledClass = disabled || loading ? 'disabled' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true">⏳</span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

