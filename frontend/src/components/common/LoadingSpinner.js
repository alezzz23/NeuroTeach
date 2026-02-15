import React from 'react';
import './LoadingSpinner.css';

export function LoadingSpinner({ size = 'medium', message = '' }) {
  const sizeClass = `spinner-${size}`;
  
  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export function Skeleton({ width, height, borderRadius = '8px' }) {
  return (
    <div 
      className="skeleton" 
      style={{ width, height, borderRadius }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" width="80%" />
      <Skeleton height="16px" width="40%" />
    </div>
  );
}
