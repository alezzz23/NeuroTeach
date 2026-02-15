import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../AuthContext';
import { historyService, analyticsService, gamificationService } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';
import { ThemeProvider } from '../../hooks/useTheme';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardTabs } from './DashboardTabs';
import { DashboardCharts } from './DashboardCharts';
import { DashboardGamification } from './DashboardGamification';
import { DashboardHistory } from './DashboardHistory';
import { DashboardGoals } from './DashboardGoals';
import { DashboardSkeleton } from '../common/Skeleton';

function DashboardContent() {
  const { getUserId, getUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const userId = getUserId();
  const userData = useMemo(() => getUserData(), [getUserData]);

  const fetchHistory = useMemo(() => async () => {
    if (!userId) return null;
    return historyService.getHistory(userId);
  }, [userId]);

  const fetchAnalytics = useMemo(() => async () => {
    if (!userId) return null;
    const [overview, emotions, progress, gamification] = await Promise.all([
      analyticsService.getOverview(userId),
      analyticsService.getEmotions(userId),
      analyticsService.getProgress(userId),
      gamificationService.getUserGamification(userId),
    ]);
    return { overview, emotions, progress, gamification };
  }, [userId]);

  const { data: history, loading: historyLoading, execute: loadHistory } = useFetch(fetchHistory, [], false);
  const { data: analyticsData, loading: analyticsLoading, execute: loadAnalytics } = useFetch(fetchAnalytics, [], false);

  const loading = historyLoading || analyticsLoading;
  const analytics = analyticsData?.overview;
  const emotionData = analyticsData?.emotions;
  const progressData = analyticsData?.progress;
  const gamification = analyticsData?.gamification;

  useEffect(() => {
    if (userId) {
      loadHistory();
      loadAnalytics();
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-user-clock text-4xl text-surface-300 mb-4"></i>
          <p className="text-surface-500">Inicia sesión para ver tu dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader userData={userData} gamification={gamification} />
        
        <DashboardStats analytics={analytics} gamification={gamification} />
        
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'overview' && (
          <>
            <DashboardCharts emotionData={emotionData} progressData={progressData} />
            <DashboardGamification gamification={gamification} />
            <DashboardHistory history={history} />
          </>
        )}
        
        {activeTab === 'progress' && (
          <DashboardCharts emotionData={emotionData} progressData={progressData} />
        )}
        
        {activeTab === 'goals' && (
          <DashboardGoals history={history} gamification={gamification} />
        )}
        
        {activeTab === 'insights' && (
          <div className="card">
            <div className="empty-state">
              <i className="fas fa-robot empty-state-icon"></i>
              <h3 className="empty-state-title">Insights IA</h3>
              <p className="empty-state-description">
                Próximamente: Análisis inteligente de tu progreso
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
