import React from 'react';

export function DashboardHistoryTable({ history, filteredHistory }) {
  const getEmotionBadgeClass = (emotion) => {
    const positive = ['feliz', 'motivado', 'concentrado', 'happy', 'motivated', 'focused'];
    const negative = ['triste', 'frustrado', 'aburrido', 'sad', 'frustrated', 'bored'];
    
    if (positive.includes(emotion?.toLowerCase())) return 'bg-success';
    if (negative.includes(emotion?.toLowerCase())) return 'bg-danger';
    return 'bg-warning';
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="slide-up">
      <h3 className="section-title">
        <i className="fas fa-history"></i>
        Historial de Sesiones
        {filteredHistory.length !== history.length && (
          <span className="badge bg-info ms-2">
            {filteredHistory.length} de {history.length} sesiones
          </span>
        )}
      </h3>
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th><i className="fas fa-calendar me-2"></i>Fecha</th>
                  <th><i className="fas fa-book me-2"></i>Tema</th>
                  <th><i className="fas fa-smile me-2"></i>Emoción</th>
                  <th><i className="fas fa-star me-2"></i>Puntuación</th>
                  <th><i className="fas fa-clock me-2"></i>Duración</th>
                  <th><i className="fas fa-coins me-2"></i>Puntos</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.date).toLocaleDateString('es-ES')}</td>
                    <td>
                      <span className="badge bg-primary">{session.topic}</span>
                    </td>
                    <td>
                      <span className={`badge ${getEmotionBadgeClass(session.emotion)}`}>
                        {session.emotion}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                          <div
                            className={`progress-bar ${getScoreClass(session.score)}`}
                            style={{ width: `${session.score}%` }}
                          ></div>
                        </div>
                        <span className="fw-bold">{session.score}%</span>
                      </div>
                    </td>
                    <td>
                      {session.duration ? `${session.duration} min` : 'N/A'}
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        <i className="fas fa-coins me-1"></i>
                        {session.pointsEarned || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
