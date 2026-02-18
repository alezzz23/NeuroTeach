import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

/**
 * Breadcrumb navigation component for consistent UX
 */
export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {!isLast && item.to ? (
                <>
                  <Link to={item.to} className="breadcrumb-link">
                    {item.icon && <i className={`fas ${item.icon}`} />}
                    <span>{item.label}</span>
                  </Link>
                  <i className="fas fa-chevron-right breadcrumb-separator" />
                </>
              ) : (
                <span className="breadcrumb-current">
                  {item.icon && <i className={`fas ${item.icon}`} />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Helper to build common breadcrumb paths
 */
export function buildBreadcrumbs(path, context = {}) {
  const { track, module, exercise } = context;
  
  const routes = {
    '/learn': [
      { label: 'Inicio', to: '/', icon: 'fa-home' },
      { label: 'Aprender', to: '/learn' },
    ],
    '/tracks': [
      { label: 'Inicio', to: '/', icon: 'fa-home' },
      { label: 'Aprender', to: '/learn' },
    ],
    '/tracks/:slug': [
      { label: 'Inicio', to: '/', icon: 'fa-home' },
      { label: 'Aprender', to: '/learn' },
      { label: track?.title || 'Track', to: `/tracks/${track?.slug}` },
    ],
    '/exercises/:id': [
      { label: 'Inicio', to: '/', icon: 'fa-home' },
      { label: 'Aprender', to: '/learn' },
      ...(track ? [{ label: track.title, to: `/tracks/${track.slug}` }] : []),
      { label: exercise?.title || 'Ejercicio' },
    ],
    '/dashboard': [
      { label: 'Inicio', to: '/', icon: 'fa-home' },
      { label: 'Dashboard' },
    ],
  };

  return routes[path] || [{ label: 'Inicio', to: '/', icon: 'fa-home' }];
}
