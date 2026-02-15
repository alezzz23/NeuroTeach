import React from 'react';

const emotionConfig = {
  feliz: { bg: 'bg-green-100', text: 'text-green-700', label: 'Feliz' },
  happy: { bg: 'bg-green-100', text: 'text-green-700', label: 'Happy' },
  motivado: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Motivado' },
  motivated: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Motivated' },
  concentrado: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Concentrado' },
  focused: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Focused' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Neutral' },
  cansado: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Cansado' },
  tired: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Tired' },
  frustrado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Frustrado' },
  frustrated: { bg: 'bg-red-100', text: 'text-red-700', label: 'Frustrated' },
  aburrido: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Aburrido' },
  bored: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Bored' },
};

function getEmotionStyle(emotion) {
  return emotionConfig[emotion?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', label: emotion };
}

function getScoreStyle(score) {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export function DashboardHistoryTable({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <i className="fas fa-history empty-state-icon"></i>
          <h3 className="empty-state-title">No hay historial</h3>
          <p className="empty-state-description">
            Completa tu primera sesión para ver tu historial aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="section-title mb-4">Historial reciente</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tema</th>
              <th>Emoción</th>
              <th>Puntuación</th>
              <th>Duración</th>
              <th>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map((session, index) => {
              const emotionStyle = getEmotionStyle(session.emotion);
              return (
                <tr key={index}>
                  <td className="font-medium">
                    {new Date(session.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td>
                    <span className="badge badge-success">{session.topic}</span>
                  </td>
                  <td>
                    <span className={`badge ${emotionStyle.bg} ${emotionStyle.text}`}>
                      {emotionStyle.label}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getScoreStyle(session.score)}`}
                          style={{ width: `${session.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{session.score}%</span>
                    </div>
                  </td>
                  <td className="text-surface-500">
                    {session.duration ? `${session.duration} min` : '—'}
                  </td>
                  <td>
                    <span className="font-medium text-amber-600">+{session.pointsEarned || 0}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
