import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './ComparisonCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ComparisonCharts({ history, filters }) {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeComparison, setActiveComparison] = useState('monthly');

  useEffect(() => {
    if (history && history.length > 0) {
      generateComparisonData();
    }
  }, [history, filters, activeComparison]);

  const generateComparisonData = () => {
    setLoading(true);
    
    setTimeout(() => {
      const data = {
        monthly: generateMonthlyComparison(),
        weekly: generateWeeklyComparison(),
        topicComparison: generateTopicComparison(),
        emotionComparison: generateEmotionComparison(),
        performanceEvolution: generatePerformanceEvolution()
      };
      
      setComparisonData(data);
      setLoading(false);
    }, 500);
  };

  const generateMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const months = [
      { name: getMonthName(twoMonthsAgo), start: twoMonthsAgo, end: lastMonth },
      { name: getMonthName(lastMonth), start: lastMonth, end: currentMonth },
      { name: getMonthName(currentMonth), start: currentMonth, end: now }
    ];

    const monthlyStats = months.map(month => {
      const monthSessions = history.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= month.start && sessionDate < month.end;
      });

      return {
        month: month.name,
        sessions: monthSessions.length,
        averageScore: monthSessions.length > 0 
          ? Math.round(monthSessions.reduce((sum, s) => sum + s.score, 0) / monthSessions.length)
          : 0,
        totalTime: monthSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0),
        topEmotion: getTopEmotion(monthSessions)
      };
    });

    return {
      labels: monthlyStats.map(stat => stat.month),
      datasets: [
        {
          label: 'Sesiones',
          data: monthlyStats.map(stat => stat.sessions),
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          yAxisID: 'y'
        },
        {
          label: 'Puntuación Promedio',
          data: monthlyStats.map(stat => stat.averageScore),
          backgroundColor: 'rgba(118, 75, 162, 0.6)',
          borderColor: 'rgba(118, 75, 162, 1)',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ],
      stats: monthlyStats
    };
  };

  const generateWeeklyComparison = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      weeks.push({
        name: i === 0 ? 'Esta semana' : i === 1 ? 'Semana pasada' : `Hace ${i} semanas`,
        start: weekStart,
        end: weekEnd
      });
    }

    const weeklyStats = weeks.map(week => {
      const weekSessions = history.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= week.start && sessionDate <= week.end;
      });

      return {
        week: week.name,
        sessions: weekSessions.length,
        averageScore: weekSessions.length > 0 
          ? Math.round(weekSessions.reduce((sum, s) => sum + s.score, 0) / weekSessions.length)
          : 0,
        consistency: calculateWeeklyConsistency(weekSessions, week.start, week.end)
      };
    });

    return {
      labels: weeklyStats.map(stat => stat.week),
      datasets: [
        {
          label: 'Sesiones por Semana',
          data: weeklyStats.map(stat => stat.sessions),
          backgroundColor: 'rgba(40, 167, 69, 0.6)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 2
        },
        {
          label: 'Consistencia (%)',
          data: weeklyStats.map(stat => stat.consistency),
          backgroundColor: 'rgba(255, 193, 7, 0.6)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 2
        }
      ],
      stats: weeklyStats
    };
  };

  const generateTopicComparison = () => {
    const topicStats = {};
    
    history.forEach(session => {
      if (!topicStats[session.topic]) {
        topicStats[session.topic] = {
          sessions: 0,
          totalScore: 0,
          totalTime: 0,
          emotions: {}
        };
      }
      
      topicStats[session.topic].sessions++;
      topicStats[session.topic].totalScore += session.score;
      topicStats[session.topic].totalTime += session.timeSpent || 0;
      
      if (!topicStats[session.topic].emotions[session.emotion]) {
        topicStats[session.topic].emotions[session.emotion] = 0;
      }
      topicStats[session.topic].emotions[session.emotion]++;
    });

    const topics = Object.keys(topicStats).map(topic => ({
      topic,
      sessions: topicStats[topic].sessions,
      averageScore: Math.round(topicStats[topic].totalScore / topicStats[topic].sessions),
      averageTime: Math.round(topicStats[topic].totalTime / topicStats[topic].sessions),
      topEmotion: Object.entries(topicStats[topic].emotions)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'
    })).sort((a, b) => b.sessions - a.sessions);

    return {
      labels: topics.map(t => t.topic),
      datasets: [
        {
          label: 'Puntuación Promedio',
          data: topics.map(t => t.averageScore),
          backgroundColor: topics.map((_, index) => 
            `hsla(${(index * 360) / topics.length}, 70%, 60%, 0.6)`
          ),
          borderColor: topics.map((_, index) => 
            `hsla(${(index * 360) / topics.length}, 70%, 50%, 1)`
          ),
          borderWidth: 2
        }
      ],
      stats: topics
    };
  };

  const generateEmotionComparison = () => {
    const emotionStats = {};
    
    history.forEach(session => {
      if (!emotionStats[session.emotion]) {
        emotionStats[session.emotion] = {
          count: 0,
          totalScore: 0,
          sessions: []
        };
      }
      
      emotionStats[session.emotion].count++;
      emotionStats[session.emotion].totalScore += session.score;
      emotionStats[session.emotion].sessions.push(session);
    });

    const emotions = Object.keys(emotionStats).map(emotion => ({
      emotion,
      count: emotionStats[emotion].count,
      percentage: Math.round((emotionStats[emotion].count / history.length) * 100),
      averageScore: Math.round(emotionStats[emotion].totalScore / emotionStats[emotion].count)
    })).sort((a, b) => b.count - a.count);

    const emotionColors = {
      'feliz': '#28a745',
      'motivado': '#17a2b8',
      'concentrado': '#6f42c1',
      'neutral': '#6c757d',
      'cansado': '#fd7e14',
      'frustrado': '#dc3545',
      'aburrido': '#ffc107',
      'ansioso': '#e83e8c'
    };

    return {
      labels: emotions.map(e => e.emotion),
      datasets: [
        {
          data: emotions.map(e => e.percentage),
          backgroundColor: emotions.map(e => emotionColors[e.emotion] || '#6c757d'),
          borderColor: '#fff',
          borderWidth: 2
        }
      ],
      stats: emotions
    };
  };

  const generatePerformanceEvolution = () => {
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const evolutionData = [];
    
    // Calcular promedio móvil de 5 sesiones
    for (let i = 0; i < sortedHistory.length; i++) {
      const start = Math.max(0, i - 4);
      const sessions = sortedHistory.slice(start, i + 1);
      const average = sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length;
      
      evolutionData.push({
        date: sortedHistory[i].date,
        score: sortedHistory[i].score,
        movingAverage: Math.round(average),
        session: i + 1
      });
    }

    return {
      labels: evolutionData.map((_, index) => `Sesión ${index + 1}`),
      datasets: [
        {
          label: 'Puntuación Individual',
          data: evolutionData.map(d => d.score),
          borderColor: 'rgba(220, 53, 69, 0.8)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderWidth: 1,
          pointRadius: 3,
          type: 'line'
        },
        {
          label: 'Promedio Móvil (5 sesiones)',
          data: evolutionData.map(d => d.movingAverage),
          borderColor: 'rgba(102, 126, 234, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderWidth: 3,
          pointRadius: 0,
          type: 'line',
          tension: 0.4
        }
      ],
      stats: evolutionData
    };
  };

  const getMonthName = (date) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[date.getMonth()];
  };

  const getTopEmotion = (sessions) => {
    if (sessions.length === 0) return 'N/A';
    
    const emotionCount = {};
    sessions.forEach(session => {
      emotionCount[session.emotion] = (emotionCount[session.emotion] || 0) + 1;
    });
    
    return Object.entries(emotionCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  };

  const calculateWeeklyConsistency = (sessions, weekStart, weekEnd) => {
    const daysInWeek = 7;
    const daysWithSessions = new Set(
      sessions.map(session => new Date(session.date).toDateString())
    ).size;
    
    return Math.round((daysWithSessions / daysInWeek) * 100);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const dualAxisOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        max: 100,
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="comparison-charts">
        <div className="comparison-header">
          <h3 className="comparison-title">
            <i className="fas fa-chart-bar me-2"></i>
            Análisis Comparativo
          </h3>
        </div>
        <div className="comparison-content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generando comparaciones...</span>
            </div>
            <p className="mt-3 text-muted">Analizando datos históricos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="comparison-charts">
        <div className="comparison-content">
          <div className="text-center py-5">
            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Sin datos suficientes</h5>
            <p className="text-muted">Necesitas más sesiones para generar comparaciones.</p>
          </div>
        </div>
      </div>
    );
  }

  const comparisons = [
    { id: 'monthly', label: 'Mensual', icon: 'fas fa-calendar-alt' },
    { id: 'weekly', label: 'Semanal', icon: 'fas fa-calendar-week' },
    { id: 'topicComparison', label: 'Por Tema', icon: 'fas fa-book' },
    { id: 'emotionComparison', label: 'Emocional', icon: 'fas fa-smile' },
    { id: 'performanceEvolution', label: 'Evolución', icon: 'fas fa-trending-up' }
  ];

  return (
    <div className="comparison-charts">
      <div className="comparison-header">
        <h3 className="comparison-title">
          <i className="fas fa-chart-bar me-2"></i>
          Análisis Comparativo
        </h3>
        <div className="comparison-tabs">
          {comparisons.map(comp => (
            <button
              key={comp.id}
              className={`comparison-tab ${activeComparison === comp.id ? 'active' : ''}`}
              onClick={() => setActiveComparison(comp.id)}
            >
              <i className={`${comp.icon} me-1`}></i>
              {comp.label}
            </button>
          ))}
        </div>
      </div>

      <div className="comparison-content">
        {activeComparison === 'monthly' && (
          <div className="chart-section">
            <h5 className="chart-subtitle">Comparación Mensual</h5>
            <div className="chart-container">
              <Bar data={comparisonData.monthly} options={dualAxisOptions} />
            </div>
            <div className="stats-summary">
              {comparisonData.monthly.stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <h6>{stat.month}</h6>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-play-circle text-primary"></i>
                      {stat.sessions} sesiones
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-star text-warning"></i>
                      {stat.averageScore}% promedio
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-smile text-info"></i>
                      {stat.topEmotion}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeComparison === 'weekly' && (
          <div className="chart-section">
            <h5 className="chart-subtitle">Comparación Semanal</h5>
            <div className="chart-container">
              <Bar data={comparisonData.weekly} options={chartOptions} />
            </div>
            <div className="stats-summary">
              {comparisonData.weekly.stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <h6>{stat.week}</h6>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-play-circle text-primary"></i>
                      {stat.sessions} sesiones
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-star text-warning"></i>
                      {stat.averageScore}% promedio
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-chart-line text-success"></i>
                      {stat.consistency}% consistencia
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeComparison === 'topicComparison' && (
          <div className="chart-section">
            <h5 className="chart-subtitle">Rendimiento por Tema</h5>
            <div className="chart-container">
              <Bar data={comparisonData.topicComparison} options={chartOptions} />
            </div>
            <div className="stats-summary">
              {comparisonData.topicComparison.stats.slice(0, 6).map((stat, index) => (
                <div key={index} className="stat-card">
                  <h6>{stat.topic}</h6>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-play-circle text-primary"></i>
                      {stat.sessions} sesiones
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-star text-warning"></i>
                      {stat.averageScore}% promedio
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-clock text-info"></i>
                      {stat.averageTime}min promedio
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeComparison === 'emotionComparison' && (
          <div className="chart-section">
            <h5 className="chart-subtitle">Distribución Emocional</h5>
            <div className="chart-container">
              <Doughnut data={comparisonData.emotionComparison} options={doughnutOptions} />
            </div>
            <div className="stats-summary">
              {comparisonData.emotionComparison.stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <h6 style={{ textTransform: 'capitalize' }}>{stat.emotion}</h6>
                  <div className="stat-details">
                    <span className="stat-item">
                      <i className="fas fa-percentage text-primary"></i>
                      {stat.percentage}% del tiempo
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-star text-warning"></i>
                      {stat.averageScore}% promedio
                    </span>
                    <span className="stat-item">
                      <i className="fas fa-play-circle text-info"></i>
                      {stat.count} sesiones
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeComparison === 'performanceEvolution' && (
          <div className="chart-section">
            <h5 className="chart-subtitle">Evolución del Rendimiento</h5>
            <div className="chart-container">
              <Line data={comparisonData.performanceEvolution} options={chartOptions} />
            </div>
            <div className="evolution-insights">
              <div className="insight-card">
                <h6>Tendencia General</h6>
                <p>
                  {comparisonData.performanceEvolution.stats.length > 1 && 
                   comparisonData.performanceEvolution.stats[comparisonData.performanceEvolution.stats.length - 1].movingAverage >
                   comparisonData.performanceEvolution.stats[0].movingAverage
                    ? 'Tu rendimiento muestra una tendencia positiva a lo largo del tiempo.'
                    : 'Tu rendimiento se mantiene estable con algunas fluctuaciones normales.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparisonCharts;