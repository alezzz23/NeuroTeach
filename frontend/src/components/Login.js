import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { authService } from '../services/api';
import { FadeIn, SlideUp } from './common/Animations';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await authService.login(email, password);
      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <FadeIn className="login-card">
        <div className="login-header">
          <i className="fas fa-brain login-icon"></i>
          <h2>Bienvenido de nuevo</h2>
          <p>Inicia sesión para continuar tu aprendizaje</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <SlideUp delay={0.1}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  id="loginEmail"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoFocus
                />
              </div>
            </div>
          </SlideUp>
          
          <SlideUp delay={0.2}>
            <div className="form-group">
              <label htmlFor="loginPassword">Contraseña</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  id="loginPassword"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </SlideUp>
          
          {error && (
            <FadeIn>
              <div className="alert-error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            </FadeIn>
          )}
          
          <SlideUp delay={0.3}>
            <button 
              type="submit" 
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Iniciar sesión
                </>
              )}
            </button>
          </SlideUp>
        </form>
        
        <SlideUp delay={0.4}>
          <div className="login-footer">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link></p>
          </div>
        </SlideUp>
      </FadeIn>
    </div>
  );
}
