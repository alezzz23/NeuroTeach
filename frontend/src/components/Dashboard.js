import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useNotification } from './NotificationSystem';
import './Dashboard.css';
import './Analytics.css';
import AnalyticsCards from './AnalyticsCards';
import AnalyticsCharts from './AnalyticsCharts';
import GamificationPanel from './GamificationPanel';

function Dashboard() {
  const { getUserId, getUserData, getToken } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userId = getUserId();
  const userData = useMemo(() => getUserData(), [getUserData]);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setError('No se pudo obtener el ID del usuario');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3000/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        throw new Error('Error al obtener el historial');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = 'Error al cargar el historial';
      setError(errorMessage);
      showError(errorMessage);
    }
  }, [userId, getToken, showError]);

  const fetchAnalytics = useCallback(async () => {
    if (!userId) {
      setError('No se pudo obtener el ID del usuario');
      setAnalyticsLoading(false);
      return;
    }

    setAnalyticsLoading(true);
    try {
      const token = getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Fetch analytics data
      const [overviewRes, emotionsRes, progressRes, gamificationRes] = await Promise.all([
        fetch(`http://localhost:3000/analytics/overview/${userId}`, { headers }),
        fetch(`http://localhost:3000/analytics/emotions/${userId}`, { headers }),
        fetch(`http://localhost:3000/analytics/progress/${userId}`, { headers }),
        fetch(`http://localhost:3000/gamification/user/${userId}`, { headers })
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setAnalytics(overviewData);
      }

      if (emotionsRes.ok) {
        const emotionsData = await emotionsRes.json();
        setEmotionData(emotionsData);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgressData(progressData);
      }

      if (gamificationRes.ok) {
        const gamificationData = await gamificationRes.json();
        setGamification(gamificationData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      const errorMessage = 'Error al cargar los datos de análisis';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [userId, getToken, showError]);

  // Efecto separado para el mensaje de bienvenida
  useEffect(() => {
    if (userId && userData) {
      const hasShownWelcome = sessionStorage.getItem('dashboardWelcomeShown');
      if (!hasShownWelcome) {
        showInfo(`¡Bienvenido de vuelta, ${userData.name || userData.email}! 🎉`);
        sessionStorage.setItem('dashboardWelcomeShown', 'true');
      }
    }
  }, [userId, userData, showInfo]);

  // Efecto principal para cargar datos
  useEffect(() => {
    const loadDashboardData = async () => {
      if (userId) {
        setLoading(true);
        setError(null);
        await Promise.all([
          fetchHistory(),
          fetchAnalytics()
        ]);
        setLoading(false);
      } else {
        setError('No se pudo obtener la información del usuario');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userId, fetchHistory, fetchAnalytics]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header fade-in">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="dashboard-title">
              <i className="fas fa-chart-line me-3"></i>
              ¡Hola, {userData?.name || 'Usuario'}!
            </h1>
            <p className="dashboard-subtitle">
              Analiza tu progreso, emociones y logros en tiempo real
            </p>
          </div>
          <div className="col-md-4 text-end">
            <div className="user-info-card">
              <div className="d-flex align-items-center justify-content-end">
                <div className="me-3">
                  <small className="text-muted d-block">Nivel actual</small>
                  <span className="badge bg-primary fs-6">
                    <i className="fas fa-star me-1"></i>
                    {gamification?.level || 1}
                  </span>
                </div>
                <div>
                  <small className="text-muted d-block">Puntos totales</small>
                  <span className="badge bg-warning text-dark fs-6">
                    <i className="fas fa-coins me-1"></i>
                    {gamification?.totalPoints || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tu dashboard personalizado...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Analytics Cards */}
      {!loading && !error && userId && (
        <div className="slide-up">
          <AnalyticsCards analytics={analytics} gamification={gamification} />
        </div>
      )}

      {/* Gamification Panel */}
      {!loading && !error && userId && gamification && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-trophy"></i>
            Gamificación y Logros
          </h3>
          <GamificationPanel gamification={gamification} />
        </div>
      )}

      {/* Analytics Charts */}
      {!loading && !error && userId && (emotionData || progressData) && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-chart-bar"></i>
            Análisis Detallado
          </h3>
          <AnalyticsCharts emotionData={emotionData} progressData={progressData} />
        </div>
      )}

      {/* History Table */}
      {!loading && !error && history.length > 0 && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-history"></i>
            Historial de Sesiones
          </h3>
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th><i className="fas fa-calendar me-2"></i>Fecha</th>
                      <th><i className="fas fa-book me-2"></i>Tema</th>
                      <th><i className="fas fa-smile me-2"></i>Emoción</th>
                      <th><i className="fas fa-star me-2"></i>Puntuación</th>
                      <th><i className="fas fa-clock me-2"></i>Duración</th>
                      <th><i className="fas fa-coins me-2"></i>Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((session, index) => (
                      <tr key={index}>
                        <td>{new Date(session.date).toLocaleDateString('es-ES')}</td>
                        <td>
                          <span className="badge bg-primary">{session.topic}</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            ['feliz', 'motivado', 'concentrado'].includes(session.emotion) 
                              ? 'bg-success' 
                              : ['triste', 'frustrado', 'aburrido'].includes(session.emotion)
                              ? 'bg-danger'
                              : 'bg-warning'
                          }`}>
                            {session.emotion}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{width: '60px', height: '8px'}}>
                              <div 
                                className={`progress-bar ${
                                  session.score >= 80 ? 'bg-success' :
                                  session.score >= 60 ? 'bg-warning' : 'bg-danger'
                                }`}
                                style={{width: `${session.score}%`}}
                              ></div>
                            </div>
                            <span className="fw-bold">{session.score}%</span>
                          </div>
                        </td>
                        <td>
                          {session.duration ? `${session.duration} min` : 'N/A'}
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-coins me-1"></i>
                            {session.pointsEarned || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && userId && history.length === 0 && !analytics && (
        <div className="text-center py-5">
          <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">¡Comienza tu viaje de aprendizaje!</h4>
          <p className="text-muted">Aún no tienes datos de sesiones. Comienza usando las funcionalidades de NeuroTeach para ver tu progreso aquí.</p>
          <div className="mt-4">
            <a href="/webcam" className="btn btn-primary me-2">
              <i className="fas fa-video me-2"></i>
              Detectar Emociones
            </a>
            <a href="/chat" className="btn btn-outline-primary">
              <i className="fas fa-robot me-2"></i>
              Chat con IA
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;