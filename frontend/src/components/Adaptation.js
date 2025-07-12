import React, { useState } from 'react';

function Adaptation() {
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
    try {
      const res = await fetch('http://localhost:3000/adaptation/next-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion, performance: Number(performance) })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Adaptación Pedagógica</h2>
      <form onSubmit={handleSend} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Emoción: </label>
          <select value={emotion} onChange={e => setEmotion(e.target.value)}>
            <option value="feliz">Feliz</option>
            <option value="frustrado">Frustrado</option>
            <option value="aburrido">Aburrido</option>
            <option value="confundido">Confundido</option>
          </select>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Rendimiento: </label>
          <input
            type="number"
            value={performance}
            onChange={e => setPerformance(e.target.value)}
            min={0}
            max={100}
            style={{ width: '60px' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Consultando...' : 'Consultar recomendación'}
        </button>
      </form>
      {result && (
        <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '5px' }}>
          <b>Acción recomendada:</b> {result.action}<br />
          <b>Mensaje:</b> {result.message}
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Adaptation; 