import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useNotification } from './NotificationSystem';
import { historyService, analyticsService, gamificationService } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import './Dashboard.css';
import './Analytics.css';
import AnalyticsCards from './AnalyticsCards';
import AnalyticsCharts from './AnalyticsCharts';
import GamificationPanel from './GamificationPanel';
import AdvancedFilters from './AdvancedFilters';
import InsightsPanel from './InsightsPanel';
import ComparisonCharts from './ComparisonCharts';
import GoalsTracker from './GoalsTracker';
import { DashboardHeader } from './DashboardHeader';
import { DashboardTabs } from './DashboardTabs';
import { DashboardHistoryTable } from './DashboardHistoryTable';
import { DashboardEmptyState } from './DashboardEmptyState';
import { LoadingSpinner } from './common/LoadingSpinner';

function Dashboard() {
  const { getUserId, getUserData } = useAuth();
  const { showInfo } = useNotification();
  
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
  const [activeTab, setActiveTab] = useState('overview');
  const [error] = useState(null);
  
  const userId = getUserId();
  const userData = useMemo(() => getUserData(), [getUserData]);

  const fetchHistory = useCallback(async () => {
    if (!userId) return null;
    return historyService.getHistory(userId);
  }, [userId]);

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return null;
    const [overview, emotions, progress, gamification] = await Promise.all([
      analyticsService.getOverview(userId),
      analyticsService.getEmotions(userId),
      analyticsService.getProgress(userId),
      gamificationService.getUserGamification(userId),
    ]);
    return { overview, emotions, progress, gamification };
  }, [userId]);

  const { data: history, loading: historyLoading, execute: loadHistory } = useFetch(
    fetchHistory,
    [userId],
    false
  );

  const { data: analyticsData, loading: analyticsLoading, execute: loadAnalytics } = useFetch(
    fetchAnalytics,
    [userId],
    false
  );

  const loading = historyLoading || analyticsLoading;
  const analytics = analyticsData?.overview;
  const emotionData = analyticsData?.emotions;
  const progressData = analyticsData?.progress;
  const gamification = analyticsData?.gamification;

  const applyFilters = useCallback((data, currentFilters) => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(session => {
      if (currentFilters.dateRange.start || currentFilters.dateRange.end) {
        const sessionDate = new Date(session.date);
        if (currentFilters.dateRange.start && sessionDate < new Date(currentFilters.dateRange.start)) return false;
        if (currentFilters.dateRange.end && sessionDate > new Date(currentFilters.dateRange.end)) return false;
      }
      if (currentFilters.topics.length > 0 && !currentFilters.topics.includes(session.topic)) return false;
      if (currentFilters.emotions.length > 0 && !currentFilters.emotions.includes(session.emotion)) return false;
      if (session.score < currentFilters.scoreRange.min || session.score > currentFilters.scoreRange.max) return false;
      return true;
    }).sort((a, b) => {
      const order = currentFilters.sortOrder === 'asc' ? 1 : -1;
      switch (currentFilters.sortBy) {
        case 'date': return order * (new Date(a.date) - new Date(b.date));
        case 'score': return order * (a.score - b.score);
        case 'topic': return order * a.topic.localeCompare(b.topic);
        default: return 0;
      }
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    const filtered = applyFilters(history || [], newFilters);
    setFilteredHistory(filtered);
  }, [history, applyFilters]);

  const generateInsights = useCallback((data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (userId && userData) {
      const hasShownWelcome = sessionStorage.getItem('dashboardWelcomeShown');
      if (!hasShownWelcome) {
        showInfo(`¡Bienvenido de vuelta, ${userData.name || userData.email}!`);
        sessionStorage.setItem('dashboardWelcomeShown', 'true');
      }
    }
  }, [userId, userData, showInfo]);

  useEffect(() => {
    if (userId) {
      loadHistory();
      loadAnalytics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (history) {
      const historyArray = Array.isArray(history) ? history : [];
      const filtered = applyFilters(historyArray, filters);
      setFilteredHistory(filtered);
      setInsights(generateInsights(historyArray));
    }
  }, [history, filters, applyFilters, generateInsights]);

  if (!userId) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader userData={userData} gamification={gamification} />

      {loading && (
        <div className="text-center py-5">
          <LoadingSpinner size="large" message="Cargando tu dashboard personalizado..." />
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <AdvancedFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            history={history || []}
          />

          {activeTab === 'overview' && (
            <>
              <AnalyticsCards analytics={analytics} gamification={gamification} />
              
              {gamification && (
                <div className="slide-up">
                  <h3 className="section-title">
                    <i className="fas fa-trophy"></i>
                    Gamificación y Logros
                  </h3>
                  <GamificationPanel gamification={gamification} />
                </div>
              )}

              {(emotionData || progressData) && (
                <div className="slide-up">
                  <h3 className="section-title">
                    <i className="fas fa-chart-bar"></i>
                    Análisis Detallado
                  </h3>
                  <AnalyticsCharts emotionData={emotionData} progressData={progressData} />
                </div>
              )}

              {filteredHistory.length > 0 && (
                <DashboardHistoryTable history={history || []} filteredHistory={filteredHistory} />
              )}
            </>
          )}

          {activeTab === 'insights' && insights && (
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

          {activeTab === 'comparisons' && (
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

          {activeTab === 'goals' && (
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

          {history?.length === 0 && !analytics && (
            <DashboardEmptyState />
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
