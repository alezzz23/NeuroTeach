import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Welcome.css';

function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const { getUserData } = useAuth();
  const navigate = useNavigate();
  const userData = getUserData();

  const steps = [
    {
      title: `¡Bienvenido a NeuroTeach, ${userData?.name || 'Usuario'}!`,
      content: (
        <div className="text-center">
          <i className="fas fa-brain fa-4x text-primary mb-4"></i>
          <p className="lead">
            Estás a punto de experimentar una revolución en el aprendizaje personalizado.
            NeuroTeach utiliza inteligencia artificial para adaptarse a tus emociones y
            maximizar tu potencial educativo.
          </p>
        </div>
      )
    },
    {
      title: "¿Cómo funciona NeuroTeach?",
      content: (
        <div className="row g-4">
          <div className="col-md-4 text-center">
            <div className="feature-highlight">
              <i className="fas fa-eye fa-3x text-success mb-3"></i>
              <h5>Detección Emocional</h5>
              <p>Analizamos tus emociones en tiempo real a través de la cámara</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="feature-highlight">
              <i className="fas fa-robot fa-3x text-info mb-3"></i>
              <h5>Tutor IA</h5>
              <p>Un asistente inteligente que se adapta a tu estilo de aprendizaje</p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="feature-highlight">
              <i className="fas fa-chart-line fa-3x text-warning mb-3"></i>
              <h5>Análisis de Progreso</h5>
              <p>Visualiza tu evolución con métricas detalladas</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Explora las funcionalidades",
      content: (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card h-100 border-primary">
              <div className="card-body text-center">
                <i className="fas fa-video fa-2x text-primary mb-3"></i>
                <h6>Webcam</h6>
                <p className="small">Detecta tus emociones en tiempo real</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-success">
              <div className="card-body text-center">
                <i className="fas fa-robot fa-2x text-success mb-3"></i>
                <h6>Chat Tutor IA</h6>
                <p className="small">Conversa con tu tutor personalizado</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-info">
              <div className="card-body text-center">
                <i className="fas fa-chart-line fa-2x text-info mb-3"></i>
                <h6>Dashboard</h6>
                <p className="small">Analiza tu progreso y estadísticas</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-warning">
              <div className="card-body text-center">
                <i className="fas fa-lightbulb fa-2x text-warning mb-3"></i>
                <h6>Adaptación</h6>
                <p className="small">Recibe recomendaciones personalizadas</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "¡Comienza tu viaje de aprendizaje!",
      content: (
        <div className="text-center">
          <i className="fas fa-rocket fa-4x text-success mb-4"></i>
          <p className="lead">
            Todo está listo. Tu dashboard personal te está esperando con
            análisis detallados y recomendaciones personalizadas.
          </p>
          <div className="alert alert-info">
            <i className="fas fa-lightbulb me-2"></i>
            <strong>Consejo:</strong> Asegúrate de permitir el acceso a la cámara
            para obtener la mejor experiencia de detección emocional.
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar como completado y redirigir al dashboard
      localStorage.setItem('welcomeCompleted', 'true');
      navigate('/dashboard');
    }
  };

  const skipTour = () => {
    localStorage.setItem('welcomeCompleted', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="welcome-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="welcome-card">
              {/* Progress Bar */}
              <div className="progress mb-4" style={{ height: '6px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Step Content */}
              <div className="welcome-content">
                <h2 className="welcome-title text-center mb-4">
                  {steps[currentStep].title}
                </h2>
                <div className="welcome-body">
                  {steps[currentStep].content}
                </div>
              </div>

              {/* Navigation */}
              <div className="welcome-navigation">
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={skipTour}
                  >
                    <i className="fas fa-forward me-2"></i>
                    Saltar tour
                  </button>
                  
                  <div className="d-flex align-items-center">
                    <span className="text-muted me-3">
                      {currentStep + 1} de {steps.length}
                    </span>
                    <button 
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      {currentStep === steps.length - 1 ? (
                        <>
                          <i className="fas fa-rocket me-2"></i>
                          ¡Comenzar!
                        </>
                      ) : (
                        <>
                          Siguiente
                          <i className="fas fa-arrow-right ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;