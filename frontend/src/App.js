import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import WebcamMock from './components/WebcamMock';
import ChatTutorIA from './components/ChatTutorIA';
import Dashboard from './components/Dashboard';
import Adaptation from './components/Adaptation';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import { AuthProvider, useAuth } from './AuthContext';

function Home() {
  return (
    <div>
      <h2>Bienvenido a NeuroTeach</h2>
      <p>Selecciona una opción en el menú.</p>
    </div>
  );
}

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="fas fa-brain me-2"></i> NeuroTeach
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/webcam"><i className="fas fa-video me-1"></i>Webcam</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/chat"><i className="fas fa-robot me-1"></i>Chat Tutor IA</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard"><i className="fas fa-chart-line me-1"></i>Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/adaptation"><i className="fas fa-lightbulb me-1"></i>Adaptación</Link>
                  </li>
                </>
              )}
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login"><i className="fas fa-sign-in-alt me-1"></i>Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register"><i className="fas fa-user-plus me-1"></i>Registro</Link>
                  </li>
                </>
              )}
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/logout"><i className="fas fa-sign-out-alt me-1"></i>Logout</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/webcam" element={<RequireAuth><WebcamMock /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><ChatTutorIA /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/adaptation" element={<RequireAuth><Adaptation /></RequireAuth>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
