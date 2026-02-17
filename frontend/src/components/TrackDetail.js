import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { learnService } from '../services/api';

export default function TrackDetail() {
  const { id } = useParams();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trackProgress, setTrackProgress] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [data, progress] = await Promise.all([
          learnService.getTrackBySlug(id),
          learnService.getTrackProgress(id).catch(() => null),
        ]);
        if (!mounted) return;
        setTrack(data);
        setTrackProgress(progress);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Error al cargar el track');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const completionByExerciseId = trackProgress?.completionByExerciseId || {};
  const totalExercises = trackProgress?.totalExercises ?? 0;
  const completedExercises = trackProgress?.completedExercises ?? 0;
  const percent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const nextExerciseId = (track?.modules || [])
    .flatMap((m) => (m.exercises || []))
    .find((ex) => !completionByExerciseId[ex.id])?.id;

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/learn" className="btn btn-link px-0">← Volver</Link>
      </div>

      {loading && <div className="alert alert-info">Cargando track...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && track && (
        <>
          <h2 className="mb-1">{track.title}</h2>
          <div className="text-muted mb-4">{track.description}</div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                <div>
                  <div className="fw-semibold">Progreso del track</div>
                  <div className="text-muted">{completedExercises} / {totalExercises} ejercicios</div>
                </div>
                {nextExerciseId && (
                  <Link to={`/exercises/${nextExerciseId}`} className="btn btn-primary">
                    Continuar
                  </Link>
                )}
              </div>
              <div className="progress mt-3" role="progressbar" aria-label="Progreso" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-bar" style={{ width: `${percent}%` }}>{percent}%</div>
              </div>
            </div>
          </div>

          {(track.modules || []).map((m) => (
            <div key={m.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-1">{m.title}</h5>
                <div className="text-muted mb-3">{m.description}</div>

                <div className="list-group">
                  {(m.exercises || []).map((ex) => (
                    <Link
                      key={ex.id}
                      to={`/exercises/${ex.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <strong>{ex.title}</strong>
                        <span className="text-muted">{' '}· {ex.language}</span>
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        {completionByExerciseId[ex.id] && (
                          <span className="badge bg-success">Completado</span>
                        )}
                        <span className="badge bg-secondary">{ex.points} pts</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
