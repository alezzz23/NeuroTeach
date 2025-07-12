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
    <div>
      <h2>Webcam (Simulada)</h2>
      <p>Haz clic para simular la captura y análisis de una imagen.</p>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analizando...' : 'Capturar y analizar'}
      </button>
      {emotion && <p>Emoción detectada: <b>{emotion}</b></p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default WebcamMock; 