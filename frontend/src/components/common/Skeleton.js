import React from 'react';
import './Skeleton.css';

export function Skeleton({ width, height, borderRadius = '8px', className = '' }) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          width={i === lines - 1 ? '70%' : '100%'} 
          height="16px" 
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 48, className = '' }) {
  return (
    <Skeleton 
      width={size} 
      height={size} 
      borderRadius="50%" 
      className={className}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-card-header">
        <SkeletonCircle size={40} />
        <div className="skeleton-card-title">
          <Skeleton width="120px" height="20px" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="skeleton-card-footer">
        <Skeleton width="100px" height="32px" borderRadius="16px" />
        <Skeleton width="80px" height="32px" borderRadius="16px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5, className = '' }) {
  return (
    <div className={`skeleton-table ${className}`}>
      <div className="skeleton-table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="100%" height="20px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height="16px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={`skeleton-chart ${className}`}>
      <div className="skeleton-chart-bars">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton 
            key={i} 
            width="40px" 
            height={`${Math.random() * 60 + 30}%`} 
            borderRadius="4px 4px 0 0"
          />
        ))}
      </div>
      <div className="skeleton-chart-labels">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width="40px" height="12px" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ items = 4, className = '' }) {
  return (
    <div className={`skeleton-list ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <SkeletonCircle size={40} />
          <div className="skeleton-list-content">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="dashboard-skeleton-header">
        <div className="dashboard-skeleton-title">
          <Skeleton width="200px" height="32px" />
          <Skeleton width="300px" height="16px" />
        </div>
        <div className="dashboard-skeleton-user">
          <Skeleton width="120px" height="48px" borderRadius="24px" />
        </div>
      </div>
      
      <div className="dashboard-skeleton-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      <div className="dashboard-skeleton-chart">
        <Skeleton width="100%" height="300px" />
      </div>
      
      <div className="dashboard-skeleton-table">
        <SkeletonTable rows={5} cols={5} />
      </div>
    </div>
  );
}

export function VirtualLabsSkeleton() {
  return (
    <div className="virtual-labs-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="chat-skeleton">
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className={`chat-skeleton-message ${i % 2 === 0 ? 'chat-skeleton-message-left' : 'chat-skeleton-message-right'}`}
        >
          <Skeleton 
            width={Math.random() * 100 + 100} 
            height="60px" 
            borderRadius="16px" 
          />
        </div>
      ))}
    </div>
  );
}
