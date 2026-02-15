import React from 'react';
import './DashboardHeader.css';

export function DashboardHeader({ userData, gamification }) {
  return (
    <div className="dashboard-header fade-in">
      <div className="row align-items-center">
        <div className="col-md-8">
          <h1 className="dashboard-title">
            <i className="fas fa-chart-line me-3"></i>
            ¡Hola, {userData?.name || 'Usuario'}!
          </h1>
          <p className="dashboard-subtitle">
            Analiza tu progreso, emociones y logros en tiempo real
          </p>
        </div>
        <div className="col-md-4 text-end">
          <div className="user-info-card">
            <div className="d-flex align-items-center justify-content-end">
              <div className="me-3">
                <small className="text-muted d-block">Nivel actual</small>
                <span className="badge bg-primary fs-6">
                  <i className="fas fa-star me-1"></i>
                  {gamification?.level || 1}
                </span>
              </div>
              <div>
                <small className="text-muted d-block">Puntos totales</small>
                <span className="badge bg-warning text-dark fs-6">
                  <i className="fas fa-coins me-1"></i>
                  {gamification?.totalPoints || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
