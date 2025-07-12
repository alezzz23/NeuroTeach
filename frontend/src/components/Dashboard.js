import React, { useState } from 'react';

function Dashboard() {
  const [userId, setUserId] = useState('123');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    setHistory(null);
    try {
      const res = await fetch(`http://localhost:3000/history/${userId}`);
      const data = await res.json();
      setHistory(data.history);
    } catch (err) {
      setError('Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dashboard de Progreso</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>ID de usuario: </label>
        <input value={userId} onChange={e => setUserId(e.target.value)} style={{ width: '100px' }} />
        <button onClick={fetchHistory} disabled={loading} style={{ marginLeft: '1rem' }}>
          {loading ? 'Cargando...' : 'Ver historial'}
        </button>
      </div>
      {history && (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tema</th>
              <th>Emoción</th>
              <th>Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{h.date}</td>
                <td>{h.topic}</td>
                <td>{h.emotion}</td>
                <td>{h.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Dashboard; 