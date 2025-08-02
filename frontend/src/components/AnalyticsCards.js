import React from 'react';

function AnalyticsCards({ analytics, gamification }) {
  if (!analytics || !gamification) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="col-md-3 col-sm-6">
            <div className="card analytics-card loading">
              <div className="card-body text-center">
                <div className="loading-skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Valores por defecto para evitar undefined
  const safeAnalytics = {
    totalSessions: 0,
    sessionsThisWeek: 0,
    averageScore: 0,
    ...analytics
  };

  const safeGamification = {
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    ...gamification
  };

  const cards = [
    {
      title: 'Sesiones Totales',
      value: safeAnalytics.totalSessions || 0,
      icon: 'fas fa-graduation-cap',
      color: 'primary',
      subtitle: `${safeAnalytics.sessionsThisWeek || 0} esta semana`,
    },
    {
      title: 'Puntuación Promedio',
      value: `${safeAnalytics.averageScore || 0}%`,
      icon: 'fas fa-chart-line',
      color: 'success',
      subtitle: 'Rendimiento general',
    },
    {
      title: 'Puntos Totales',
      value: safeGamification.totalPoints || 0,
      icon: 'fas fa-star',
      color: 'warning',
      subtitle: `Nivel ${safeGamification.level || 1}`,
    },
    {
      title: 'Racha Actual',
      value: `${safeGamification.currentStreak || 0} días`,
      icon: 'fas fa-fire',
      color: 'danger',
      subtitle: `Máxima: ${safeGamification.longestStreak || 0} días`,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card, index) => (
        <div key={index} className="col-md-3 col-sm-6">
          <div className={`card analytics-card border-${card.color}`}>
            <div className="card-body text-center">
              <div className={`analytics-icon text-${card.color} mb-2`}>
                <i className={card.icon}></i>
              </div>
              <h3 className="analytics-value mb-1">{card.value}</h3>
              <p className="analytics-title text-muted mb-1">{card.title}</p>
              <small className="analytics-subtitle text-muted">{card.subtitle}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsCards;