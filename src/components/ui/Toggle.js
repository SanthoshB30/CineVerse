import React from 'react';

/**
 * Toggle Component
 * iOS-style toggle switch for boolean settings
 */
const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      className={`toggle-container ${disabled ? 'disabled' : ''} ${className}`}
    >
      <div className="toggle-label-group">
        {label && <span className="toggle-label">{label}</span>}
        {description && (
          <span className="toggle-description">{description}</span>
        )}
      </div>

      <div className="toggle-wrapper">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="toggle-input"
          {...props}
        />
        <span className="toggle-slider">
          <span className="toggle-knob" />
        </span>
      </div>
    </label>
  );
};

export default Toggle;

