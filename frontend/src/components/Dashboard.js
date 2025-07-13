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
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="fas fa-chart-line me-2 text-primary"></i>Dashboard de Progreso
              </h2>
              <form className="row g-3 align-items-center mb-3" onSubmit={e => { e.preventDefault(); fetchHistory(); }}>
                <div className="col-auto">
                  <label htmlFor="userIdInput" className="col-form-label">ID de usuario:</label>
                </div>
                <div className="col-auto">
                  <input
                    id="userIdInput"
                    className="form-control"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    style={{ width: '120px' }}
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <i className="fas fa-history me-1"></i>
                    {loading ? 'Cargando...' : 'Ver historial'}
                  </button>
                </div>
              </form>
              {history && (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle mt-3">
                    <thead className="table-primary">
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
                          <td><span className="badge bg-info text-dark"><i className="fas fa-smile me-1"></i>{h.emotion}</span></td>
                          <td><span className="fw-bold">{h.score}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default Dashboard; 