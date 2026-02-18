import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CompletionModal.css';

/**
 * Modal shown when user completes an exercise
 * Shows XP earned, streak, and next exercise recommendation
 */
export default function CompletionModal({
  isOpen,
  onClose,
  exercise,
  pointsEarned = 0,
  streakDays = 0,
  nextExercise = null,
  trackSlug = null,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`completion-modal-overlay ${visible ? 'visible' : ''}`} onClick={onClose}>
      <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
        <button className="completion-modal-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <div className="completion-modal-header">
          <div className="completion-icon">
            <i className="fas fa-check-circle" />
          </div>
          <h2>¡Ejercicio completado!</h2>
          <p className="completion-exercise-title">{exercise?.title || 'Ejercicio'}</p>
        </div>

        <div className="completion-modal-body">
          <div className="completion-stats">
            <div className="completion-stat">
              <div className="completion-stat-icon">
                <i className="fas fa-star" />
              </div>
              <div className="completion-stat-value">{pointsEarned}</div>
              <div className="completion-stat-label">XP ganado</div>
            </div>

            <div className="completion-stat">
              <div className="completion-stat-icon">
                <i className="fas fa-fire" />
              </div>
              <div className="completion-stat-value">{streakDays}</div>
              <div className="completion-stat-label">Racha (días)</div>
            </div>
          </div>

          {nextExercise && (
            <div className="completion-next">
              <div className="completion-next-label">Siguiente ejercicio:</div>
              <Link
                to={`/exercises/${nextExercise.id}`}
                className="completion-next-link"
                onClick={onClose}
              >
                <span>{nextExercise.title}</span>
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          )}
        </div>

        <div className="completion-modal-footer">
          {trackSlug ? (
            <Link to={`/tracks/${trackSlug}`} className="completion-btn completion-btn-secondary" onClick={onClose}>
              <i className="fas fa-list" />
              Ver track
            </Link>
          ) : (
            <button className="completion-btn completion-btn-secondary" onClick={onClose}>
              <i className="fas fa-times" />
              Cerrar
            </button>
          )}

          {nextExercise ? (
            <Link to={`/exercises/${nextExercise.id}`} className="completion-btn completion-btn-primary" onClick={onClose}>
              Continuar
              <i className="fas fa-arrow-right" />
            </Link>
          ) : (
            <Link to="/learn" className="completion-btn completion-btn-primary" onClick={onClose}>
              <i className="fas fa-graduation-cap" />
              Ver más tracks
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
