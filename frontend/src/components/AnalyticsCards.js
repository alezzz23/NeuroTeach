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

  const cards = [
    {
      title: 'Sesiones Totales',
      value: analytics.totalSessions,
      icon: 'fas fa-graduation-cap',
      color: 'primary',
      subtitle: `${analytics.sessionsThisWeek} esta semana`,
    },
    {
      title: 'Puntuación Promedio',
      value: `${analytics.averageScore}%`,
      icon: 'fas fa-chart-line',
      color: 'success',
      subtitle: 'Rendimiento general',
    },
    {
      title: 'Puntos Totales',
      value: gamification.totalPoints,
      icon: 'fas fa-star',
      color: 'warning',
      subtitle: `Nivel ${gamification.level}`,
    },
    {
      title: 'Racha Actual',
      value: `${gamification.currentStreak} días`,
      icon: 'fas fa-fire',
      color: 'danger',
      subtitle: `Máxima: ${gamification.longestStreak} días`,
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