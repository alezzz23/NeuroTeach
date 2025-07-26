import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

function Adaptation() {
  const { getToken } = useAuth();
  const [emotion, setEmotion] = useState('feliz');
  const [performance, setPerformance] = useState(80);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    const token = getToken();
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/adaptation/next-step', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emotion, performance: Number(performance) })
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="fas fa-lightbulb me-2 text-primary"></i>Adaptación Pedagógica
              </h2>
              <form className="row g-3 align-items-center mb-3" onSubmit={handleSend}>
                <div className="col-12 col-md-6 mb-2 mb-md-0">
                  <label htmlFor="emotionSelect" className="form-label">Emoción:</label>
                  <select
                    id="emotionSelect"
                    className="form-select"
                    value={emotion}
                    onChange={e => setEmotion(e.target.value)}
                  >
                    <option value="feliz">Feliz</option>
                    <option value="frustrado">Frustrado</option>
                    <option value="aburrido">Aburrido</option>
                    <option value="confundido">Confundido</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label htmlFor="performanceInput" className="form-label">Rendimiento:</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-percentage"></i></span>
                    <input
                      id="performanceInput"
                      type="number"
                      className="form-control"
                      value={performance}
                      onChange={e => setPerformance(e.target.value)}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <div className="col-12 d-grid mt-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <i className="fas fa-search me-2"></i>{loading ? 'Consultando...' : 'Consultar recomendación'}
                  </button>
                </div>
              </form>
              {result && (
                <div className="alert alert-success mt-3">
                  <b>Acción recomendada:</b> {result.action}<br />
                  <b>Mensaje:</b> {result.message}
                </div>
              )}
              {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adaptation;