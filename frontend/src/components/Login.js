import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Credenciales inválidas');
      const user = await res.json();
      login(user);
      // Guarda el token en localStorage (opcional, ya lo hace AuthContext)
      // localStorage.setItem('access_token', user.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: '100%' }}>
        <div className="text-center mb-4">
          <i className="fas fa-user-circle fa-3x text-primary mb-2"></i>
          <h2 className="mb-0">Iniciar sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-envelope"></i></span>
              <input
                id="loginEmail"
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <div className="alert alert-danger py-2 text-center">{error}</div>}
          <div className="d-grid mb-2">
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-sign-in-alt me-2"></i>Entrar
            </button>
          </div>
        </form>
        <div className="text-center mt-2">
          <span>¿No tienes cuenta? <a href="/register">Regístrate</a></span>
        </div>
      </div>
    </div>
  );
} 