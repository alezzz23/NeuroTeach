import React, { useState, useEffect } from 'react';
import './InsightsPanel.css';

function InsightsPanel({ analytics, emotionData, progressData, history }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('correlations');

  useEffect(() => {
    if (analytics && emotionData && progressData && history) {
      generateInsights();
    }
  }, [analytics, emotionData, progressData, history]);

  const generateInsights = () => {
    setLoading(true);
    
    // Simular procesamiento de insights
    setTimeout(() => {
      const generatedInsights = {
        correlations: calculateCorrelations(),
        trends: analyzeTrends(),
        recommendations: generateRecommendations(),
        predictions: makePredictions()
      };
      
      setInsights(generatedInsights);
      setLoading(false);
    }, 1000);
  };

  const calculateCorrelations = () => {
    if (!history || history.length === 0) return [];

    // Correlación emoción-rendimiento
    const emotionScores = {};
    history.forEach(session => {
      if (!emotionScores[session.emotion]) {
        emotionScores[session.emotion] = [];
      }
      emotionScores[session.emotion].push(session.score);
    });

    const correlations = Object.entries(emotionScores).map(([emotion, scores]) => {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const sessions = scores.length;
      
      let impact = 'neutral';
      let color = 'warning';
      
      if (avgScore >= 80) {
        impact = 'positive';
        color = 'success';
      } else if (avgScore < 60) {
        impact = 'negative';
        color = 'danger';
      }

      return {
        emotion,
        averageScore: Math.round(avgScore),
        sessions,
        impact,
        color,
        strength: sessions >= 3 ? 'strong' : 'weak'
      };
    }).sort((a, b) => b.averageScore - a.averageScore);

    return correlations;
  };

  const analyzeTrends = () => {
    if (!history || history.length < 5) return [];

    const trends = [];
    const recentSessions = history.slice(-10);
    const olderSessions = history.slice(-20, -10);

    // Tendencia de puntuación
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length;
    const olderAvg = olderSessions.length > 0 
      ? olderSessions.reduce((sum, s) => sum + s.score, 0) / olderSessions.length 
      : recentAvg;
    
    const scoreTrend = recentAvg - olderAvg;
    
    trends.push({
      type: 'score',
      title: 'Tendencia de Puntuación',
      value: `${scoreTrend > 0 ? '+' : ''}${Math.round(scoreTrend)}%`,
      direction: scoreTrend > 0 ? 'up' : scoreTrend < 0 ? 'down' : 'stable',
      color: scoreTrend > 0 ? 'success' : scoreTrend < 0 ? 'danger' : 'warning',
      description: scoreTrend > 0 
        ? 'Tu rendimiento está mejorando' 
        : scoreTrend < 0 
        ? 'Tu rendimiento ha disminuido' 
        : 'Tu rendimiento se mantiene estable'
    });

    // Tendencia de consistencia
    const recentConsistency = calculateConsistency(recentSessions);
    const olderConsistency = olderSessions.length > 0 ? calculateConsistency(olderSessions) : recentConsistency;
    const consistencyTrend = recentConsistency - olderConsistency;

    trends.push({
      type: 'consistency',
      title: 'Consistencia',
      value: `${Math.round(recentConsistency)}%`,
      direction: consistencyTrend > 0 ? 'up' : consistencyTrend < 0 ? 'down' : 'stable',
      color: recentConsistency > 70 ? 'success' : recentConsistency > 50 ? 'warning' : 'danger',
      description: recentConsistency > 70 
        ? 'Mantienes un rendimiento muy consistente' 
        : 'Hay oportunidades para mejorar la consistencia'
    });

    return trends;
  };

  const calculateConsistency = (sessions) => {
    if (sessions.length < 2) return 100;
    
    const scores = sessions.map(s => s.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convertir a porcentaje de consistencia (menor desviación = mayor consistencia)
    return Math.max(0, 100 - (standardDeviation * 2));
  };

  const generateRecommendations = () => {
    if (!insights && (!analytics || !emotionData)) return [];

    const recommendations = [];

    // Recomendaciones basadas en emociones
    if (emotionData && emotionData.distribution) {
      const negativeEmotions = ['frustrado', 'aburrido', 'triste', 'ansioso'];
      const hasNegativeEmotions = Object.keys(emotionData.distribution)
        .some(emotion => negativeEmotions.includes(emotion));

      if (hasNegativeEmotions) {
        recommendations.push({
          type: 'emotional',
          priority: 'high',
          title: 'Gestión Emocional',
          description: 'Se detectaron emociones negativas frecuentes durante el estudio.',
          action: 'Considera tomar descansos más frecuentes y practicar técnicas de relajación.',
          icon: 'fas fa-heart',
          color: 'danger'
        });
      }
    }

    // Recomendaciones basadas en rendimiento
    if (analytics && analytics.averageScore < 70) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: 'Mejora del Rendimiento',
        description: 'Tu puntuación promedio está por debajo del objetivo.',
        action: 'Revisa los temas con menor puntuación y dedica más tiempo a la práctica.',
        icon: 'fas fa-chart-line',
        color: 'warning'
      });
    }

    // Recomendaciones de consistencia
    if (history && history.length > 0) {
      const lastWeekSessions = history.filter(
        h => new Date(h.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      
      if (lastWeekSessions.length < 3) {
        recommendations.push({
          type: 'consistency',
          priority: 'medium',
          title: 'Aumentar Frecuencia',
          description: 'Has tenido pocas sesiones esta semana.',
          action: 'Intenta estudiar al menos 3-4 veces por semana para mantener el progreso.',
          icon: 'fas fa-calendar-check',
          color: 'info'
        });
      }
    }

    // Recomendación positiva
    if (analytics && analytics.currentStreak >= 7) {
      recommendations.push({
        type: 'motivation',
        priority: 'low',
        title: '¡Excelente Racha!',
        description: `Llevas ${analytics.currentStreak} días consecutivos estudiando.`,
        action: 'Mantén este ritmo y considera aumentar gradualmente la dificultad.',
        icon: 'fas fa-fire',
        color: 'success'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const makePredictions = () => {
    if (!history || history.length < 5) return [];

    const predictions = [];
    const recentTrend = analyzeTrends();
    const scoreTrend = recentTrend.find(t => t.type === 'score');

    if (scoreTrend) {
      const currentAvg = analytics?.averageScore || 0;
      const trendValue = parseFloat(scoreTrend.value.replace('%', '').replace('+', ''));
      const predictedScore = Math.min(100, Math.max(0, currentAvg + (trendValue * 2)));

      predictions.push({
        type: 'score_prediction',
        title: 'Predicción de Rendimiento',
        description: `Basado en tu tendencia actual, tu puntuación promedio podría ser`,
        value: `${Math.round(predictedScore)}%`,
        confidence: history.length >= 10 ? 'alta' : 'media',
        timeframe: 'próximas 2 semanas',
        color: predictedScore >= 80 ? 'success' : predictedScore >= 60 ? 'warning' : 'danger'
      });
    }

    return predictions;
  };

  if (loading) {
    return (
      <div className="insights-panel">
        <div className="insights-header">
          <h3 className="insights-title">
            <i className="fas fa-brain me-2"></i>
            Insights Inteligentes
          </h3>
        </div>
        <div className="insights-content">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Analizando datos...</span>
            </div>
            <p className="mt-3 text-muted">Generando insights personalizados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="insights-panel">
        <div className="insights-content">
          <div className="text-center py-4">
            <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">Datos insuficientes</h5>
            <p className="text-muted">Necesitas al menos 5 sesiones para generar insights.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'correlations', label: 'Correlaciones', icon: 'fas fa-link' },
    { id: 'trends', label: 'Tendencias', icon: 'fas fa-trending-up' },
    { id: 'recommendations', label: 'Recomendaciones', icon: 'fas fa-lightbulb' },
    { id: 'predictions', label: 'Predicciones', icon: 'fas fa-crystal-ball' }
  ];

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h3 className="insights-title">
          <i className="fas fa-brain me-2"></i>
          Insights Inteligentes
        </h3>
        <div className="insights-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`${tab.icon} me-1`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="insights-content">
        {activeTab === 'correlations' && (
          <div className="correlations-section">
            <h5 className="section-subtitle">Correlación Emoción-Rendimiento</h5>
            <div className="correlations-grid">
              {insights.correlations.map((correlation, index) => (
                <div key={index} className={`correlation-card ${correlation.color}`}>
                  <div className="correlation-header">
                    <span className="emotion-name">{correlation.emotion}</span>
                    <span className={`badge bg-${correlation.color}`}>
                      {correlation.averageScore}%
                    </span>
                  </div>
                  <div className="correlation-details">
                    <small className="text-muted">
                      {correlation.sessions} sesiones • 
                      Correlación {correlation.strength === 'strong' ? 'fuerte' : 'débil'}
                    </small>
                  </div>
                  <div className="correlation-impact">
                    <i className={`fas fa-${correlation.impact === 'positive' ? 'arrow-up text-success' : 
                      correlation.impact === 'negative' ? 'arrow-down text-danger' : 'minus text-warning'}`}></i>
                    <span className="impact-text">
                      {correlation.impact === 'positive' ? 'Impacto positivo' : 
                       correlation.impact === 'negative' ? 'Impacto negativo' : 'Impacto neutral'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="trends-section">
            <h5 className="section-subtitle">Análisis de Tendencias</h5>
            <div className="trends-grid">
              {insights.trends.map((trend, index) => (
                <div key={index} className={`trend-card border-${trend.color}`}>
                  <div className="trend-header">
                    <h6 className="trend-title">{trend.title}</h6>
                    <div className={`trend-value text-${trend.color}`}>
                      <i className={`fas fa-arrow-${trend.direction === 'up' ? 'up' : 
                        trend.direction === 'down' ? 'down' : 'right'} me-1`}></i>
                      {trend.value}
                    </div>
                  </div>
                  <p className="trend-description">{trend.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="recommendations-section">
            <h5 className="section-subtitle">Recomendaciones Personalizadas</h5>
            <div className="recommendations-list">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="recommendation-icon">
                    <i className={`${rec.icon} text-${rec.color}`}></i>
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-header">
                      <h6 className="recommendation-title">{rec.title}</h6>
                      <span className={`badge bg-${rec.color} priority-badge`}>
                        {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <p className="recommendation-description">{rec.description}</p>
                    <div className="recommendation-action">
                      <i className="fas fa-lightbulb me-2 text-warning"></i>
                      <strong>Acción sugerida:</strong> {rec.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="predictions-section">
            <h5 className="section-subtitle">Predicciones Basadas en IA</h5>
            <div className="predictions-grid">
              {insights.predictions.map((prediction, index) => (
                <div key={index} className={`prediction-card border-${prediction.color}`}>
                  <div className="prediction-header">
                    <h6 className="prediction-title">{prediction.title}</h6>
                    <span className={`confidence-badge bg-${prediction.confidence === 'alta' ? 'success' : 'warning'}`}>
                      Confianza {prediction.confidence}
                    </span>
                  </div>
                  <div className="prediction-content">
                    <p className="prediction-description">{prediction.description}</p>
                    <div className={`prediction-value text-${prediction.color}`}>
                      {prediction.value}
                    </div>
                    <small className="text-muted">en las {prediction.timeframe}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsPanel;