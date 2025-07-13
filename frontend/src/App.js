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
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/">Inicio</Link>
        {user && <Link to="/webcam">Webcam</Link>}
        {user && <Link to="/chat">Chat Tutor IA</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <Link to="/adaptation">Adaptación</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Registro</Link>}
        {user && <Link to="/logout">Logout</Link>}
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
