import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardEmptyState.css';

export function DashboardEmptyState() {
  return (
    <div className="text-center py-5">
      <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
      <h4 className="text-muted">¡Comienza tu viaje de aprendizaje!</h4>
      <p className="text-muted">
        Aún no tienes datos de sesiones. Comienza usando las funcionalidades de NeuroTeach para ver tu progreso aquí.
      </p>
      <div className="mt-4">
        <Link to="/webcam" className="btn btn-primary me-2">
          <i className="fas fa-video me-2"></i>
          Detectar Emociones
        </Link>
        <Link to="/chat" className="btn btn-outline-primary">
          <i className="fas fa-robot me-2"></i>
          Chat con IA
        </Link>
      </div>
    </div>
  );
}
