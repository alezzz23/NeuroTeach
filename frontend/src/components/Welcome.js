import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import NeuralBackground from './NeuralBackground';
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
          <img src="/logo.png" alt="NeuroTeach" className="welcome-logo" />
          <p className="lead">
            Retoma tu progreso, completa ejercicios y visualiza tu avance.
          </p>
          <div className="welcome-cta-row">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Ir al dashboard</button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/learn')}>Elegir un track</button>
          </div>
        </div>
      )
    },
    {
      title: "Empieza en 1 minuto",
      content: (
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="welcome-feature" role="button" tabIndex={0} onClick={() => navigate('/learn')} onKeyDown={(e) => e.key === 'Enter' && navigate('/learn')}>
              <div className="welcome-feature-icon"><i className="fas fa-graduation-cap" /></div>
              <div className="welcome-feature-title">Aprende</div>
              <div className="welcome-feature-text">Elige un track y avanza con ejercicios.</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="welcome-feature" role="button" tabIndex={0} onClick={() => navigate('/chat')} onKeyDown={(e) => e.key === 'Enter' && navigate('/chat')}>
              <div className="welcome-feature-icon"><i className="fas fa-robot" /></div>
              <div className="welcome-feature-title">Pide ayuda</div>
              <div className="welcome-feature-text">Usa el tutor IA cuando te atasques.</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="welcome-feature" role="button" tabIndex={0} onClick={() => navigate('/dashboard')} onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard')}>
              <div className="welcome-feature-icon"><i className="fas fa-chart-line" /></div>
              <div className="welcome-feature-title">Mide progreso</div>
              <div className="welcome-feature-text">Sigue tu XP, racha y actividad.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tip rápido",
      content: (
        <div className="text-center">
          <div className="welcome-tip">
            <i className="fas fa-video me-2" />
            Si quieres usar detección emocional, habilita la cámara en la sección <strong>Emociones</strong>.
          </div>
          <div className="welcome-cta-row">
            <button className="btn btn-outline-primary" onClick={() => navigate('/webcam')}>Configurar cámara</button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Continuar</button>
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
      <NeuralBackground />
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