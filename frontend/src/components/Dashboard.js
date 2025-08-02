import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useNotification } from './NotificationSystem';
import { API_BASE_URL } from '../config';
import './Dashboard.css';
import './Analytics.css';
import AnalyticsCards from './AnalyticsCards';
import AnalyticsCharts from './AnalyticsCharts';
import GamificationPanel from './GamificationPanel';
import AdvancedFilters from './AdvancedFilters';
import InsightsPanel from './InsightsPanel';
import ComparisonCharts from './ComparisonCharts';
import GoalsTracker from './GoalsTracker';

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
  
  // New state for enhanced dashboard features
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    topics: [],
    emotions: [],
    scoreRange: { min: 0, max: 100 },
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [insights, setInsights] = useState(null);
  const [comparisons, setComparisons] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const userId = getUserId();
  const userData = useMemo(() => getUserData(), [getUserData]);

  // Filter and data processing functions
  const applyFilters = useCallback((data, currentFilters) => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(session => {
      // Date range filter
      if (currentFilters.dateRange.start || currentFilters.dateRange.end) {
        const sessionDate = new Date(session.date);
        if (currentFilters.dateRange.start && sessionDate < new Date(currentFilters.dateRange.start)) return false;
        if (currentFilters.dateRange.end && sessionDate > new Date(currentFilters.dateRange.end)) return false;
      }
      
      // Topics filter
      if (currentFilters.topics.length > 0 && !currentFilters.topics.includes(session.topic)) return false;
      
      // Emotions filter
      if (currentFilters.emotions.length > 0 && !currentFilters.emotions.includes(session.emotion)) return false;
      
      // Score range filter
      if (session.score < currentFilters.scoreRange.min || session.score > currentFilters.scoreRange.max) return false;
      
      return true;
    }).sort((a, b) => {
      const order = currentFilters.sortOrder === 'asc' ? 1 : -1;
      switch (currentFilters.sortBy) {
        case 'date':
          return order * (new Date(a.date) - new Date(b.date));
        case 'score':
          return order * (a.score - b.score);
        case 'topic':
          return order * a.topic.localeCompare(b.topic);
        default:
          return 0;
      }
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    const filtered = applyFilters(history, newFilters);
    setFilteredHistory(filtered);
  }, [history, applyFilters]);

  const generateInsights = useCallback((data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    // Calculate emotion-performance correlations
    const emotionScores = {};
    data.forEach(session => {
      if (!emotionScores[session.emotion]) {
        emotionScores[session.emotion] = [];
      }
      emotionScores[session.emotion].push(session.score);
    });
    
    const correlations = Object.entries(emotionScores).map(([emotion, scores]) => ({
      emotion,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      sessions: scores.length
    })).sort((a, b) => b.avgScore - a.avgScore);
    
    // Calculate trends
    const recentSessions = data.slice(-10);
    const avgRecentScore = recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length;
    const olderSessions = data.slice(-20, -10);
    const avgOlderScore = olderSessions.length > 0 ? olderSessions.reduce((sum, s) => sum + s.score, 0) / olderSessions.length : avgRecentScore;
    
    return {
      correlations,
      trends: {
        scoreImprovement: avgRecentScore - avgOlderScore,
        recentAverage: avgRecentScore,
        totalSessions: data.length
      },
      recommendations: generateRecommendations(correlations, data)
    };
  }, []);

  const generateRecommendations = useCallback((correlations, data) => {
    const recommendations = [];
    
    if (!Array.isArray(correlations) || !Array.isArray(data)) return recommendations;
    
    if (correlations.length > 0) {
      const bestEmotion = correlations[0];
      const worstEmotion = correlations[correlations.length - 1];
      
      if (bestEmotion.avgScore > worstEmotion.avgScore + 10) {
        recommendations.push({
          type: 'emotion',
          title: 'Optimiza tu estado emocional',
          description: `Rindes mejor cuando te sientes ${bestEmotion.emotion} (${bestEmotion.avgScore.toFixed(1)}% vs ${worstEmotion.avgScore.toFixed(1)}%)`
        });
      }
    }
    
    const recentScores = data.slice(-5).map(s => s.score);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    
    if (avgRecent < 70) {
      recommendations.push({
        type: 'performance',
        title: 'Mejora tu rendimiento',
        description: 'Considera tomar descansos más frecuentes o revisar el material antes de las sesiones'
      });
    }
    
    return recommendations;
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!userId) {
      setError('No se pudo obtener el ID del usuario');
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Asegurar que data sea un array
        const historyArray = Array.isArray(data) ? data : [];
        setHistory(historyArray);
        const filtered = applyFilters(historyArray, filters);
        setFilteredHistory(filtered);
        const generatedInsights = generateInsights(historyArray);
        setInsights(generatedInsights);
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
        fetch(`${API_BASE_URL}/analytics/overview/${userId}`, { headers }),
        fetch(`${API_BASE_URL}/analytics/emotions/${userId}`, { headers }),
        fetch(`${API_BASE_URL}/analytics/progress/${userId}`, { headers }),
        fetch(`${API_BASE_URL}/gamification/user/${userId}`, { headers })
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

      {/* Navigation Tabs */}
      {!loading && !error && userId && (
        <div className="slide-up mb-4">
          <ul className="nav nav-pills nav-fill dashboard-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-chart-line me-2"></i>
                Resumen
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                <i className="fas fa-lightbulb me-2"></i>
                Insights IA
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'comparisons' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparisons')}
              >
                <i className="fas fa-chart-bar me-2"></i>
                Comparaciones
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveTab('goals')}
              >
                <i className="fas fa-target me-2"></i>
                Objetivos
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Advanced Filters */}
      {!loading && !error && userId && (
        <div className="slide-up">
          <AdvancedFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            history={history}
          />
        </div>
      )}

      {/* Analytics Cards */}
      {!loading && !error && userId && activeTab === 'overview' && (
        <div className="slide-up">
          <AnalyticsCards analytics={analytics} gamification={gamification} />
        </div>
      )}

      {/* Gamification Panel - Overview Tab */}
      {!loading && !error && userId && gamification && activeTab === 'overview' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-trophy"></i>
            Gamificación y Logros
          </h3>
          <GamificationPanel gamification={gamification} />
        </div>
      )}

      {/* Analytics Charts - Overview Tab */}
      {!loading && !error && userId && (emotionData || progressData) && activeTab === 'overview' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-chart-bar"></i>
            Análisis Detallado
          </h3>
          <AnalyticsCharts emotionData={emotionData} progressData={progressData} />
        </div>
      )}

      {/* Insights Panel - Insights Tab */}
      {!loading && !error && userId && insights && activeTab === 'insights' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-lightbulb"></i>
            Insights Inteligentes
          </h3>
          <InsightsPanel 
            insights={insights}
            history={filteredHistory}
            analytics={analytics}
          />
        </div>
      )}

      {/* Comparison Charts - Comparisons Tab */}
      {!loading && !error && userId && activeTab === 'comparisons' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-chart-bar"></i>
            Análisis Comparativo
          </h3>
          <ComparisonCharts 
            history={filteredHistory}
            analytics={analytics}
            emotionData={emotionData}
            progressData={progressData}
          />
        </div>
      )}

      {/* Goals Tracker - Goals Tab */}
      {!loading && !error && userId && activeTab === 'goals' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-target"></i>
            Seguimiento de Objetivos
          </h3>
          <GoalsTracker 
            userId={userId}
            analytics={analytics}
            history={filteredHistory}
          />
        </div>
      )}

      {/* History Table - Overview Tab */}
      {!loading && !error && filteredHistory.length > 0 && activeTab === 'overview' && (
        <div className="slide-up">
          <h3 className="section-title">
            <i className="fas fa-history"></i>
            Historial de Sesiones
            {filteredHistory.length !== history.length && (
              <span className="badge bg-info ms-2">
                {filteredHistory.length} de {history.length} sesiones
              </span>
            )}
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
                    {filteredHistory.map((session, index) => (
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