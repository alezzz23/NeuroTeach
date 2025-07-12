import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WebcamMock from './components/WebcamMock';
import ChatTutorIA from './components/ChatTutorIA';
import Dashboard from './components/Dashboard';
import Adaptation from './components/Adaptation';

function Home() {
  return (
    <div>
      <h2>Bienvenido a NeuroTeach</h2>
      <p>Selecciona una opción en el menú.</p>
    </div>
  );
}

function App() {
  return (
    <Router> 
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/">Inicio</Link>
        <Link to="/webcam">Webcam</Link>
        <Link to="/chat">Chat Tutor IA</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/adaptation">Adaptación</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/webcam" element={<WebcamMock />} />
        <Route path="/chat" element={<ChatTutorIA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adaptation" element={<Adaptation />} />
      </Routes>
    </Router>
  );
}

export default App;
