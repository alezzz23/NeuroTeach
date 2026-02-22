import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import WebcamMock from './components/WebcamMock';
import ChatTutorIA from './components/ChatTutorIA';
import Dashboard from './components/Dashboard';
import LearnTracks from './components/LearnTracks';
import TrackDetail from './components/TrackDetail';
import ExerciseWorkspace from './components/ExerciseWorkspace';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';

import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';
import LandingPage from './components/LandingPage';
import Welcome from './components/Welcome';
import InternalNavbar from './components/InternalNavbar';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider } from './components/NotificationSystem';
import { ToastContainer } from './components/common/Toast';
import './components/common/Toast.css';


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
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  // Navbar interna: solo para usuarios autenticados y fuera del flujo de auth/onboarding
  const hideNavbarRoutes = ['/', '/login', '/register', '/welcome'];
  const showNavbar = !!user && !hideNavbarRoutes.includes(pathname);

  return (
    <>
      {showNavbar && (
        <InternalNavbar />
      )}
      <Routes>
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/welcome" element={<RequireAuth><Welcome /></RequireAuth>} />

        <Route path="/webcam" element={<RequireAuth><WebcamMock /></RequireAuth>} />
        <Route path="/chat" element={<RequireAuth><ChatTutorIA /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuthWithWelcome><Dashboard /></RequireAuthWithWelcome>} />
        <Route path="/learn" element={<RequireAuth><LearnTracks /></RequireAuth>} />
        <Route path="/tracks/:id" element={<RequireAuth><TrackDetail /></RequireAuth>} />
        <Route path="/exercises/:id" element={<RequireAuth><ExerciseWorkspace /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
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
          <ToastContainerWrapper />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

function ToastContainerWrapper() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handleToast = (e) => {
      const { message, type } = e.detail;
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, message, type: type || 'info' }]);
    };
    window.addEventListener('app:toast', handleToast);
    return () => window.removeEventListener('app:toast', handleToast);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

export default App;
