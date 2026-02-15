import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './InternalNavbar.css';

export default function InternalNavbar() {
  const location = useLocation();
  const { getUserData } = useAuth();
  const userData = getUserData();
  const pathname = location.pathname;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'fa-th-large', match: (p) => p === '/dashboard' },
    { to: '/webcam', label: 'Emociones', icon: 'fa-video', match: (p) => p === '/webcam' },
    { to: '/chat', label: 'Chat IA', icon: 'fa-robot', match: (p) => p === '/chat' },
    { to: '/adaptation', label: 'Adaptación', icon: 'fa-cogs', match: (p) => p === '/adaptation' },
  ];

  return (
    <nav className="inav">
      <div className="inav-container">
        <Link className="inav-brand" to="/dashboard">
          <i className="fas fa-brain inav-brand-icon" />
          <span>NeuroTeach</span>
        </Link>

        <div className="inav-links" aria-label="Navegación">
          {navItems.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inav-link ${active ? 'is-active' : ''}`}
              >
                <i className={`fas ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="inav-user">
          {userData && (
            <div className="inav-userinfo" title={userData.name || userData.email}>
              <div className="inav-avatar">
                <i className="fas fa-user" />
              </div>
              <span className="inav-username">{userData.name || userData.email}</span>
            </div>
          )}

          <Link className="inav-logout" to="/logout" title="Cerrar sesión">
            <i className="fas fa-sign-out-alt" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
