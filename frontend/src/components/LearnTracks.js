import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learnService } from '../services/api';

export default function LearnTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await learnService.listTracksWithProgress();
        if (!mounted) return;
        setTracks(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Error al cargar tracks');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="container py-4">Cargando tracks...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-1">Aprender</h2>
          <div className="text-muted">Elige un track y practica con ejercicios.</div>
        </div>
      </div>

      <div className="row g-3">
        {tracks.map((t) => (
          <div key={t.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between">
                  <h5 className="card-title mb-2">{t.title}</h5>
                </div>
                <p className="card-text text-muted flex-grow-1">{t.description}</p>

                <div className="mb-3">
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: 12 }}>
                    <span>{t.progress?.completedExercises ?? 0} / {t.progress?.totalExercises ?? 0}</span>
                    <span>{t.progress?.percent ?? 0}%</span>
                  </div>
                  <div className="progress" role="progressbar" aria-label="Progreso" aria-valuenow={t.progress?.percent ?? 0} aria-valuemin={0} aria-valuemax={100}>
                    <div className="progress-bar" style={{ width: `${t.progress?.percent ?? 0}%` }} />
                  </div>
                </div>

                <Link to={`/tracks/${t.slug}`} className="btn btn-primary w-100">
                  {t.progress?.completedExercises ? 'Continuar' : 'Ver track'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
