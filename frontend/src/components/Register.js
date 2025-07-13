import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('No se pudo registrar');
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <i className="fas fa-user-plus fa-3x text-primary mb-2"></i>
          <h2 className="mb-0">Registro</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="registerName" className="form-label">Nombre</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                id="registerName"
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="registerEmail" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-envelope"></i></span>
              <input
                id="registerEmail"
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="registerPassword" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                id="registerPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
          {success && <div className="alert alert-success py-2 text-center">{success}</div>}
          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-user-plus me-2"></i>Registrarse
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <span>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></span>
        </div>
      </div>
    </div>
  );
} 