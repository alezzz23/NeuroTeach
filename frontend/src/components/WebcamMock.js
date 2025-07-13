import React, { useState } from 'react';

function WebcamMock() {
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setEmotion(null);
    try {
      const res = await fetch('http://localhost:3000/emotion/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: 'mock-base64-image' })
      });
      const data = await res.json();
      setEmotion(data.emotion);
    } catch (err) {
      setError('Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">
                <i className="fas fa-video me-2 text-primary"></i>Webcam (Simulada)
              </h2>
              <p>Haz clic para simular la captura y análisis de una imagen.</p>
              <button className="btn btn-primary mb-3" onClick={handleAnalyze} disabled={loading}>
                <i className="fas fa-camera me-2"></i>{loading ? 'Analizando...' : 'Capturar y analizar'}
              </button>
              {emotion && <div className="alert alert-info"><b>Emoción detectada:</b> <span className="text-capitalize">{emotion}</span></div>}
              {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamMock; 