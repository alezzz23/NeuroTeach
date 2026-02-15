import React from 'react';
import './Card.css';

export function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  padding = true,
  hoverable = false,
  className = '',
  ...props
}) {
  const classes = [
    'custom-card',
    padding && 'card-padding',
    hoverable && 'card-hoverable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || icon || action) && (
        <div className="card-header">
          <div className="card-title-group">
            {icon && <span className="card-icon">{icon}</span>}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export function CardSkeleton({ hasHeader = true }) {
  return (
    <div className="custom-card card-padding">
      {hasHeader && (
        <div className="card-header">
          <div className="card-title-group">
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: 120, height: 20 }} />
              <div className="skeleton" style={{ width: 80, height: 14 }} />
            </div>
          </div>
        </div>
      )}
      <div className="card-body">
        <div className="skeleton" style={{ width: '100%', height: 60 }} />
        <div className="skeleton" style={{ width: '70%', height: 16 }} />
      </div>
    </div>
  );
}
