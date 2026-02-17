import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { learnService } from '../services/api';

export default function DashboardLearningPanel() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await learnService.getDashboardSummary();
        if (!mounted) return;
        setSummary(data);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'No se pudo cargar el resumen de aprendizaje');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const next = summary?.nextExercise || null;
  const tracksInProgress = Array.isArray(summary?.tracksInProgress) ? summary.tracksInProgress : [];
  const metrics = summary?.metrics || {};

  const primaryCta = useMemo(() => {
    if (next?.id) return { to: `/exercises/${next.id}`, label: 'Continuar' };
    return { to: '/learn', label: 'Empezar' };
  }, [next]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div>
            <div className="fw-semibold">Mi aprendizaje</div>
            <div className="text-muted">
              {next ? (
                <>Siguiente: <strong>{next.title}</strong> <span className="text-muted">· {next.trackTitle}</span></>
              ) : (
                <>Empieza un track para ver recomendaciones personalizadas.</>
              )}
            </div>
          </div>
          <Link className="btn btn-primary" to={primaryCta.to}>
            {primaryCta.label}
          </Link>
        </div>

        {loading && <div className="mt-3 text-muted">Cargando resumen...</div>}
        {error && <div className="mt-3 text-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3 mt-1">
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="text-muted" style={{ fontSize: 12 }}>Ejercicios completados (7 días)</div>
                <div className="fs-4 fw-semibold">{metrics.completedThisWeek ?? 0}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="text-muted" style={{ fontSize: 12 }}>Racha por ejercicios (días)</div>
                <div className="fs-4 fw-semibold">{metrics.exerciseStreakDays ?? 0}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <div className="text-muted" style={{ fontSize: 12 }}>Intentos promedio (completados)</div>
                <div className="fs-4 fw-semibold">{metrics.avgAttemptsCompleted ?? 0}</div>
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between mt-2 mb-2">
                <div className="fw-semibold">Tracks en progreso</div>
                <Link to="/learn" className="btn btn-link px-0">Ver todos</Link>
              </div>

              {tracksInProgress.length === 0 ? (
                <div className="text-muted">Aún no tienes tracks en progreso. Empieza en <Link to="/learn">Aprender</Link>.</div>
              ) : (
                <div className="row g-3">
                  {tracksInProgress.map((t) => (
                    <div key={t.slug} className="col-12 col-md-4">
                      <div className="border rounded p-3 h-100">
                        <div className="fw-semibold">{t.title}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{t.progress.completedExercises} / {t.progress.totalExercises}</div>
                        <div className="progress my-2" role="progressbar" aria-label="Progreso" aria-valuenow={t.progress.percent} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-bar" style={{ width: `${t.progress.percent}%` }} />
                        </div>
                        <Link to={`/tracks/${t.slug}`} className="btn btn-outline-primary w-100">Continuar</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
