import React from 'react';

function GamificationPanel({ gamification }) {
  if (!gamification) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="loading-skeleton"></div>
        </div>
      </div>
    );
  }

  const achievements = [
    {
      id: 'FIRST_SESSION',
      name: 'Primera Sesión',
      description: 'Completaste tu primera sesión de aprendizaje',
      icon: 'fas fa-play-circle',
      color: 'success',
    },
    {
      id: 'CONSISTENT_LEARNER',
      name: 'Estudiante Consistente',
      description: 'Mantuviste una racha de 7 días',
      icon: 'fas fa-calendar-check',
      color: 'primary',
    },
    {
      id: 'EMOTIONAL_MASTER',
      name: 'Maestro Emocional',
      description: 'Mantuviste emociones positivas en 10 sesiones',
      icon: 'fas fa-heart',
      color: 'danger',
    },
    {
      id: 'POINT_COLLECTOR',
      name: 'Coleccionista de Puntos',
      description: 'Alcanzaste 1000 puntos',
      icon: 'fas fa-coins',
      color: 'warning',
    },
    {
      id: 'STUDY_MARATHON',
      name: 'Maratón de Estudio',
      description: 'Estudiaste por más de 2 horas en una sesión',
      icon: 'fas fa-stopwatch',
      color: 'info',
    },
  ];

  const progressPercentage = (gamification.progressToNextLevel * 100).toFixed(1);

  return (
    <div className="row g-3">
      {/* Panel de Nivel y Progreso */}
      <div className="col-md-6">
        <div className="card gamification-card">
          <div className="card-body text-center">
            <div className="level-badge mb-3">
              <i className="fas fa-trophy level-icon"></i>
              <h2 className="level-number">Nivel {gamification.level}</h2>
            </div>
            <div className="progress-container mb-3">
              <div className="progress level-progress">
                <div 
                  className="progress-bar bg-gradient-primary" 
                  role="progressbar" 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {progressPercentage}%
                </div>
              </div>
              <small className="text-muted">
                {gamification.pointsToNextLevel} puntos para el siguiente nivel
              </small>
            </div>
            <div className="stats-row">
              <div className="stat-item">
                <i className="fas fa-star text-warning"></i>
                <span className="stat-value">{gamification.totalPoints}</span>
                <span className="stat-label">Puntos</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-fire text-danger"></i>
                <span className="stat-value">{gamification.currentStreak}</span>
                <span className="stat-label">Racha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Logros */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fas fa-medal me-2"></i>
              Logros ({gamification.achievements?.length || 0}/{achievements.length})
            </h5>
          </div>
          <div className="card-body">
            <div className="achievements-grid">
              {achievements.map((achievement) => {
                const isUnlocked = gamification.achievements?.includes(achievement.id) || false;
                return (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                    title={achievement.description}
                  >
                    <div className={`achievement-icon text-${achievement.color}`}>
                      <i className={achievement.icon}></i>
                    </div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-desc">{achievement.description}</div>
                    </div>
                    {isUnlocked && (
                      <div className="achievement-check">
                        <i className="fas fa-check-circle text-success"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamificationPanel;