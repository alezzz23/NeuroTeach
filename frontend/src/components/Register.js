import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import NeuralBackground from './NeuralBackground';
import './Register.css';

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
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('No se pudo registrar');
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { message: '¡Cuenta creada! Ya puedes iniciar sesión.', type: 'success' }
      }));
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { message: err.message || 'Error al registrar', type: 'error' }
      }));
    }
  };

  return (
    <div className="register-container">
      <NeuralBackground />
      <div className="register-card">
        <div className="register-header">
          <div className="register-brand">
            <img src="/logo.png" alt="NeuroTeach" className="register-logo" />
          </div>
          <h2>Crea tu cuenta</h2>
          <p>Empieza gratis y accede al dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label htmlFor="registerName">Nombre</label>
            <div className="register-input-wrap">
              <i className="fas fa-user register-input-icon"></i>
              <input
                id="registerName"
                type="text"
                className="register-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="registerEmail">Email</label>
            <div className="register-input-wrap">
              <i className="fas fa-envelope register-input-icon"></i>
              <input
                id="registerEmail"
                type="email"
                className="register-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="registerPassword">Contraseña</label>
            <div className="register-input-wrap">
              <i className="fas fa-lock register-input-icon"></i>
              <input
                id="registerPassword"
                type="password"
                className="register-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="register-alert register-alert-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="register-alert register-alert-success">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          <button type="submit" className="register-submit">
            <i className="fas fa-user-plus"></i>
            Crear cuenta
          </button>
        </form>

        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}