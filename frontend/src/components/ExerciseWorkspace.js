import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gamificationService, learnService, tutorService } from '../services/api';
import { useAuth } from '../AuthContext';

export default function ExerciseWorkspace() {
  const { id } = useParams();
  const exerciseId = useMemo(() => Number(id), [id]);
  const { getUserId } = useAuth();

  const [exercise, setExercise] = useState(null);
  const [progress, setProgress] = useState(null);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [validation, setValidation] = useState(null);
  const [savedStatus, setSavedStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  const [tutorPrompt, setTutorPrompt] = useState('');
  const [tutorEmotion, setTutorEmotion] = useState('motivado');
  const [tutorAnswer, setTutorAnswer] = useState(null);
  const [tutorLoading, setTutorLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const ex = await learnService.getExerciseById(exerciseId);
        const pr = await learnService.getExerciseProgress(exerciseId).catch(() => null);
        if (!mounted) return;
        setExercise(ex);
        setProgress(pr);

        const initialCode = (pr?.code ?? ex?.starterCode ?? '') || '';
        setCode(initialCode);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Error al cargar ejercicio');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [exerciseId]);

  const handleRun = async () => {
    try {
      setRunning(true);
      setError(null);
      setValidation(null);

      const res = await learnService.runExercise(exerciseId, { code });
      setOutput(res?.output || '');

      await learnService.saveExerciseProgress(exerciseId, { code }).catch(() => null);
    } catch (e) {
      setOutput('');
      setError(e?.message || 'Error al ejecutar');
    } finally {
      setRunning(false);
    }
  };

  const handleValidate = async () => {
    try {
      const onValidate = async () => {
        try {
          setValidating(true);
          setSavedStatus(null);
          const res = await learnService.validateExercise(exerciseId, { code });
          setValidation(res);

          if (res?.ok) {
            await learnService.saveExerciseProgress(exerciseId, { code, isCompleted: true });
            const userId = getUserId();
            if (userId && exercise?.points) {
              await gamificationService.addPoints({
                userId,
                points: Number(exercise.points) || 0,
                reason: `Ejercicio completado: ${exercise.title}`,
              }).catch(() => null);
            }
            if (userId) {
              await gamificationService.updateStreak({ userId }).catch(() => null);
              await gamificationService.checkAchievements({ userId }).catch(() => null);
            }

            const pr = await learnService.getExerciseProgress(exerciseId).catch(() => null);
            setProgress(pr);
            setSavedStatus('Progreso guardado');
          }
        } catch (e) {
          setValidation({ ok: false, errors: [e.message] });
        } finally {
          setValidating(false);
        }
      };
      onValidate();
    } catch (e) {
      setValidation(null);
      setError(e?.message || 'Error al validar');
    }
  };

  const askTutor = async (e) => {
    e.preventDefault();
    try {
      setTutorLoading(true);
      setTutorAnswer(null);

      const context = {
        prompt: `${tutorPrompt}\n\n[Contexto del ejercicio]\nTítulo: ${exercise?.title}\nDescripción: ${exercise?.description}\nInstrucciones: ${JSON.stringify(exercise?.instructions || [])}\nLenguaje: ${exercise?.language}\n\n[Mi código]\n${code}\n\n[Último output]\n${output}\n\n[Última validación]\n${validation ? JSON.stringify(validation) : ''}`,
        emotion: tutorEmotion,
      };

      const res = await tutorService.ask(context.prompt, { emotion: context.emotion });
      setTutorAnswer(res?.choices?.[0]?.message?.content || JSON.stringify(res));
    } catch (err) {
      setTutorAnswer('Error al conectar con el tutor');
    } finally {
      setTutorLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">Cargando ejercicio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/learn" className="btn btn-link px-0">← Aprender</Link>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card mb-3">
            <div className="card-body">
              <h3 className="mb-1">{exercise?.title}</h3>
              <div className="text-muted mb-3">{exercise?.description}</div>

              {(exercise?.instructions || []).length > 0 && (
                <div className="mb-3">
                  <div className="fw-semibold mb-2">Instrucciones</div>
                  <ol className="mb-0">
                    {(exercise.instructions || []).map((it, idx) => (
                      <li key={idx}>{String(it)}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-outline-primary" onClick={handleRun} disabled={running}>
                  {running ? 'Ejecutando...' : 'Run'}
                </button>
                <button className="btn btn-success" onClick={handleValidate} disabled={validating}>
                  {validating ? 'Validando...' : 'Validar'}
                </button>
              </div>

              {savedStatus && <div className="alert alert-success py-2">{savedStatus}</div>}

              {output && (
                <pre className="mt-3 p-3 bg-light border rounded" style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
              )}

              {validation && (
                <div className={`alert ${validation.ok ? 'alert-success' : 'alert-danger'}`}>
                  {validation.ok ? '✅ Correcto' : (
                    <ul className="mb-0">
                      {(validation.errors || []).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                  {Array.isArray(validation.details) && validation.details.length > 0 && (
                    <div className="mt-2">
                      <div className="fw-semibold mb-1">Detalles</div>
                      <ul className="mb-0">
                        {validation.details.map((d) => (
                          <li key={d.index}>
                            Caso {Number(d.index) + 1}: {d.ok ? 'OK' : 'Falló'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-semibold">Entrega ({exercise?.type || 'code'})</div>
                {progress?.isCompleted && (
                  <span className="badge bg-success">Completado</span>
                )}
              </div>

              {(!exercise?.type || exercise?.type === 'code' || exercise?.type === 'algorithm') && (
                <textarea
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={16}
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                />
              )}

              {exercise?.type === 'terminal' && (
                <div className="alert alert-info mb-0">
                  Este tipo de ejercicio se validará con comandos (`submission.commands`). UI pendiente.
                </div>
              )}

              {exercise?.type === 'diagram' && (
                <div className="alert alert-info mb-0">
                  Este tipo de ejercicio se validará con un JSON de diagrama (`submission.nodes/edges`). UI pendiente.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-2">Tutor IA</h5>
              <div className="text-muted mb-3">Pídele ayuda con tu código o con el enunciado.</div>

              <form onSubmit={askTutor}>
                <div className="mb-2">
                  <label className="form-label">Tu pregunta</label>
                  <input
                    className="form-control"
                    value={tutorPrompt}
                    onChange={(e) => setTutorPrompt(e.target.value)}
                    placeholder="Ej: ¿Por qué falla mi solución?"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Emoción</label>
                  <select className="form-select" value={tutorEmotion} onChange={(e) => setTutorEmotion(e.target.value)}>
                    <option value="feliz">Feliz</option>
                    <option value="motivado">Motivado</option>
                    <option value="frustrado">Frustrado</option>
                    <option value="confundido">Confundido</option>
                    <option value="aburrido">Aburrido</option>
                  </select>
                </div>

                <button className="btn btn-outline-success w-100" type="submit" disabled={tutorLoading}>
                  {tutorLoading ? 'Consultando...' : 'Preguntar'}
                </button>
              </form>

              {tutorAnswer && (
                <div className="alert alert-success mt-3" style={{ whiteSpace: 'pre-wrap' }}>
                  {tutorAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
