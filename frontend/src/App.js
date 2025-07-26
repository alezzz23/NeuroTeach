import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import WebcamMock from './components/WebcamMock';
import ChatTutorIA from './components/ChatTutorIA';
import Dashboard from './components/Dashboard';
import Adaptation from './components/Adaptation';
import Courses from './components/Courses';
import Lesson from './components/Lesson';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import LandingPage from './components/LandingPage';
import Welcome from './components/Welcome';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider } from './components/NotificationSystem';

// Componente Home removido - ahora usamos LandingPage

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAuthWithWelcome({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificar si el usuario necesita ver el welcome
  const welcomeCompleted = localStorage.getItem('welcomeCompleted');
  if (!welcomeCompleted && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user, getUserData } = useAuth();
  const location = useLocation();
  const userData = getUserData();
  
  // No mostrar navbar en la landing page y welcome
  const showNavbar = (location.pathname !== '/' && location.pathname !== '/welcome') || user;
  
  return (
    <>
      {showNavbar && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <Link className="navbar-brand" to="/dashboard">
              <i className="fas fa-brain me-2"></i>
              NeuroTeach
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="fas fa-tachometer-alt me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                    <i className="fas fa-book me-1"></i>
                    Cursos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/webcam">
                    <i className="fas fa-video me-1"></i>
                    Detección Emocional
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">
                    <i className="fas fa-robot me-1"></i>
                    Chat IA
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/adaptation">
                    <i className="fas fa-cogs me-1"></i>
                    Adaptación
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                {userData && (
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                      <i className="fas fa-user-circle me-1"></i>
                      {userData.name || userData.email}
                    </a>
                    <ul className="dropdown-menu">
                      <li><h6 className="dropdown-header">Mi Cuenta</h6></li>
                      <li><span className="dropdown-item-text"><small className="text-muted">{userData.email}</small></span></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/welcome"><i className="fas fa-graduation-cap me-2"></i>Tour de Bienvenida</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/logout"><i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</Link></li>
                    </ul>
                  </li>
                )}
                {!userData && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Cerrar Sesión
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/welcome" element={<RequireAuth><Welcome /></RequireAuth>} />
        <Route path="/courses" element={<RequireAuthWithWelcome><Courses /></RequireAuthWithWelcome>} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<RequireAuthWithWelcome><Lesson /></RequireAuthWithWelcome>} />
        <Route path="/webcam" element={<RequireAuth><WebcamMock /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><ChatTutorIA /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuthWithWelcome><Dashboard /></RequireAuthWithWelcome>} />
        <Route path="/adaptation" element={<RequireAuth><Adaptation /></RequireAuth>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
