import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="hero-logo-container mb-4">
                  <img src="/logo.png" alt="NeuroTeach" className="hero-logo" />
                </div>
                <h1 className="hero-title">
                  <span className="gradient-text">NeuroTeach</span>
                  <br />
                  Educación que se adapta a ti
                </h1>
                <p className="hero-subtitle">
                  Revoluciona tu aprendizaje con inteligencia artificial que detecta tus emociones 
                  y adapta el contenido en tiempo real para maximizar tu potencial educativo.
                </p>
                <div className="hero-buttons">
                  <Link to="/register" className="btn btn-primary btn-lg me-3">
                    <i className="fas fa-rocket me-2"></i>
                    Comenzar Gratis
                  </Link>
                  <Link to="/login" className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="floating-card">
                  <img src="/logo.png" alt="NeuroTeach" className="brain-icon" />
                  <div className="emotion-indicators">
                    <span className="emotion-dot happy"></span>
                    <span className="emotion-dot focused"></span>
                    <span className="emotion-dot engaged"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">¿Por qué elegir NeuroTeach?</h2>
              <p className="section-subtitle">
                Tecnología de vanguardia al servicio de tu educación
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h3>Detección Emocional</h3>
                <p>
                  Analiza tus emociones en tiempo real a través de la cámara para 
                  adaptar el contenido según tu estado de ánimo.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <h3>Tutor IA Personalizado</h3>
                <p>
                  Un asistente inteligente que se adapta a tu estilo de aprendizaje 
                  y te guía paso a paso.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Análisis de Progreso</h3>
                <p>
                  Visualiza tu evolución con métricas detalladas y 
                  recomendaciones personalizadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title">¿Cómo funciona?</h2>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4>Regístrate</h4>
                <p>Crea tu cuenta gratuita en segundos</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card">
                <div className="step-number">2</div>
                <h4>Configura tu perfil</h4>
                <p>Personaliza tu experiencia de aprendizaje</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card">
                <div className="step-number">3</div>
                <h4>Comienza a aprender</h4>
                <p>La IA se adapta a tus emociones automáticamente</p>
              </div>
            </div>
            <div className="col-md-3 text-center">
              <div className="step-card">
                <div className="step-number">4</div>
                <h4>Mejora continua</h4>
                <p>Recibe feedback personalizado y evoluciona</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="cta-title">¿Listo para revolucionar tu aprendizaje?</h2>
              <p className="cta-subtitle">
                Únete a miles de estudiantes que ya están transformando su educación
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                <i className="fas fa-rocket me-2"></i>
                Comenzar Ahora - Es Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer py-4 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>
                <img src="/logo.png" alt="NeuroTeach" className="footer-logo me-2" />
                NeuroTeach
              </h5>
              <p>Educación inteligente para el futuro</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p>&copy; 2024 NeuroTeach. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;