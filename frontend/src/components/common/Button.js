import React from 'react';
import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'custom-button',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
