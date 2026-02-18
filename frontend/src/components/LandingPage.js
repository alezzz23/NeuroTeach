import React from 'react';
import { Link } from 'react-router-dom';
import NeuralBackground from './NeuralBackground';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <NeuralBackground />
      <div className="lp-content">
        <header className="lp-header">
          <div className="lp-container">
            <div className="lp-header-inner">
              <Link to="/" className="lp-brand">
                <img src="/logo.png" alt="NeuroTeach" className="lp-brand-logo" />
                <span className="lp-brand-name">NeuroTeach</span>
              </Link>
              <nav className="lp-nav">
                <a className="lp-nav-link" href="#features">Funcionalidades</a>
                <a className="lp-nav-link" href="#how">Cómo funciona</a>
                <a className="lp-nav-link" href="#cta">Empezar</a>
              </nav>
              <div className="lp-header-actions">
                <Link to="/login" className="lp-btn lp-btn-ghost">Iniciar sesión</Link>
                <Link to="/register" className="lp-btn lp-btn-primary">Regístrate gratis</Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <section className="lp-hero">
            <div className="lp-container">
              <div className="lp-hero-grid">
                <div className="lp-hero-copy">
                  <h1 className="lp-hero-title">Aprende con una experiencia que se adapta a ti</h1>
                  <p className="lp-hero-subtitle">
                    NeuroTeach detecta emociones, ajusta el ritmo y te ayuda a mantener el foco con IA.
                  </p>
                  <div className="lp-hero-cta">
                    <Link to="/register" className="lp-btn lp-btn-primary lp-btn-lg">Comenzar gratis</Link>
                    <Link to="/login" className="lp-btn lp-btn-secondary lp-btn-lg">Ya tengo cuenta</Link>
                  </div>
                  <div className="lp-hero-note">
                    <span className="lp-pill">
                      <i className="fas fa-lock"></i>
                      Tus datos, bajo tu control
                    </span>
                    <span className="lp-pill">
                      <i className="fas fa-bolt"></i>
                      Configuración en minutos
                    </span>
                  </div>
                </div>
                <div className="lp-hero-visual" aria-hidden="true">
                  <div className="lp-visual-card">
                    <div className="lp-visual-top">
                      <div className="lp-dot" />
                      <div className="lp-dot" />
                      <div className="lp-dot" />
                    </div>
                    <div className="lp-visual-content">
                      <div className="lp-visual-metric">
                        <div className="lp-visual-metric-label">Estado</div>
                        <div className="lp-visual-metric-value">Enfoque</div>
                      </div>
                      <div className="lp-visual-bar">
                        <div className="lp-visual-bar-fill" />
                      </div>
                      <div className="lp-visual-row">
                        <div className="lp-chip"><i className="fas fa-video"></i> Emociones</div>
                        <div className="lp-chip"><i className="fas fa-robot"></i> Tutor IA</div>
                        <div className="lp-chip"><i className="fas fa-chart-line"></i> Progreso</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="lp-section">
            <div className="lp-container">
              <div className="lp-section-head">
                <h2 className="lp-section-title">Todo lo que necesitas para mejorar de verdad</h2>
                <p className="lp-section-subtitle">Una plataforma moderna, simple y potente.</p>
              </div>
              <div className="lp-grid-3">
                <div className="lp-feature">
                  <div className="lp-feature-icon"><i className="fas fa-eye"></i></div>
                  <h3 className="lp-feature-title">Detección emocional</h3>
                  <p className="lp-feature-text">Lectura de señales para ajustar la experiencia en tiempo real.</p>
                </div>
                <div className="lp-feature">
                  <div className="lp-feature-icon"><i className="fas fa-robot"></i></div>
                  <h3 className="lp-feature-title">Tutor IA</h3>
                  <p className="lp-feature-text">Acompañamiento paso a paso, explicaciones y práctica guiada.</p>
                </div>
                <div className="lp-feature">
                  <div className="lp-feature-icon"><i className="fas fa-chart-line"></i></div>
                  <h3 className="lp-feature-title">Dashboard de progreso</h3>
                  <p className="lp-feature-text">Métricas y patrones para entender qué te funciona mejor.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="how" className="lp-section lp-section-muted">
            <div className="lp-container">
              <div className="lp-section-head">
                <h2 className="lp-section-title">Tu flujo, sin fricción</h2>
                <p className="lp-section-subtitle">Entra, aprende y mide tu progreso.</p>
              </div>
              <div className="lp-steps">
                <div className="lp-step">
                  <div className="lp-step-number">1</div>
                  <div>
                    <div className="lp-step-title">Crea tu cuenta</div>
                    <div className="lp-step-text">Registro simple y rápido.</div>
                  </div>
                </div>
                <div className="lp-step">
                  <div className="lp-step-number">2</div>
                  <div>
                    <div className="lp-step-title">Inicia tu sesión</div>
                    <div className="lp-step-text">Accede a tus herramientas y recursos.</div>
                  </div>
                </div>
                <div className="lp-step">
                  <div className="lp-step-number">3</div>
                  <div>
                    <div className="lp-step-title">Aprende con IA</div>
                    <div className="lp-step-text">Tutor + detección emocional + adaptación.</div>
                  </div>
                </div>
                <div className="lp-step">
                  <div className="lp-step-number">4</div>
                  <div>
                    <div className="lp-step-title">Revisa tu dashboard</div>
                    <div className="lp-step-text">Entiende tu avance con claridad.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="cta" className="lp-cta">
            <div className="lp-container">
              <div className="lp-cta-inner">
                <div>
                  <h2 className="lp-cta-title">Empieza hoy</h2>
                  <p className="lp-cta-text">Crea tu cuenta gratis y prueba el flujo completo.</p>
                </div>
                <div className="lp-cta-actions">
                  <Link to="/register" className="lp-btn lp-btn-primary lp-btn-lg">Crear cuenta</Link>
                  <Link to="/login" className="lp-btn lp-btn-ghost lp-btn-lg">Iniciar sesión</Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="lp-footer">
          <div className="lp-container">
            <div className="lp-footer-inner">
              <div className="lp-footer-brand">
                <img src="/logo.png" alt="NeuroTeach" className="lp-footer-logo" />
                <span>NeuroTeach</span>
              </div>
              <div className="lp-footer-meta">&copy; 2024 NeuroTeach. Todos los derechos reservados.</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;