import React, { useState, useEffect } from 'react';
import './GoalsTracker.css';

function GoalsTracker({ analytics, history }) {
  const [goals, setGoals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'score',
    target: '',
    timeframe: 'weekly',
    category: 'performance'
  });
  const [loading, setLoading] = useState(false);

  // Valores por defecto para evitar undefined
  const safeAnalytics = {
    averageScore: 0,
    currentStreak: 0,
    totalSessions: 0,
    ...analytics
  };

  const safeHistory = history || [];

  useEffect(() => {
    loadGoals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (goals.length > 0 && safeHistory) {
      updateGoalsProgress();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, analytics]);

  const loadGoals = () => {
    // Simular carga de metas desde localStorage o API
    const savedGoals = localStorage.getItem('neuroteach_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Crear metas por defecto
      const defaultGoals = createDefaultGoals();
      setGoals(defaultGoals);
      localStorage.setItem('neuroteach_goals', JSON.stringify(defaultGoals));
    }
  };

  const createDefaultGoals = () => {
    return [
      {
        id: 1,
        title: 'Mejorar Puntuación Promedio',
        description: 'Alcanzar un 85% de puntuación promedio',
        type: 'score',
        target: 85,
        current: analytics?.averageScore || 0,
        timeframe: 'monthly',
        category: 'performance',
        createdAt: new Date().toISOString(),
        status: 'active',
        progress: 0
      },
      {
        id: 2,
        title: 'Mantener Racha de Estudio',
        description: 'Estudiar 7 días consecutivos',
        type: 'streak',
        target: 7,
        current: analytics?.currentStreak || 0,
        timeframe: 'ongoing',
        category: 'consistency',
        createdAt: new Date().toISOString(),
        status: 'active',
        progress: 0
      },
      {
        id: 3,
        title: 'Completar 20 Sesiones',
        description: 'Realizar 20 sesiones de estudio este mes',
        type: 'sessions',
        target: 20,
        current: analytics?.totalSessions || 0,
        timeframe: 'monthly',
        category: 'volume',
        createdAt: new Date().toISOString(),
        status: 'active',
        progress: 0
      }
    ];
  };

  const updateGoalsProgress = () => {
    const updatedGoals = goals.map(goal => {
      let current = 0;
      
      switch (goal.type) {
        case 'score':
          current = safeAnalytics.averageScore || 0;
          break;
        case 'streak':
          current = safeAnalytics.currentStreak || 0;
          break;
        case 'sessions':
          if (goal.timeframe === 'weekly') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            current = safeHistory.filter(h => new Date(h.date) >= weekAgo).length || 0;
          } else if (goal.timeframe === 'monthly') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            current = safeHistory.filter(h => new Date(h.date) >= monthAgo).length || 0;
          } else {
            current = safeAnalytics.totalSessions || 0;
          }
          break;
        case 'time':
          if (goal.timeframe === 'weekly') {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            current = safeHistory.filter(h => new Date(h.date) >= weekAgo)
              .reduce((sum, h) => sum + (h.timeSpent || 0), 0) || 0;
          } else {
            current = safeHistory.reduce((sum, h) => sum + (h.timeSpent || 0), 0) || 0;
          }
          break;
        default:
          current = goal.current;
      }
      
      const progress = Math.min(100, Math.round((current / goal.target) * 100));
      const status = progress >= 100 ? 'completed' : 
                    progress >= 75 ? 'near_completion' : 'active';
      
      return {
        ...goal,
        current,
        progress,
        status
      };
    });
    
    setGoals(updatedGoals);
    localStorage.setItem('neuroteach_goals', JSON.stringify(updatedGoals));
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    
    setLoading(true);
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: parseFloat(newGoal.target),
      current: 0,
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    setTimeout(() => {
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      localStorage.setItem('neuroteach_goals', JSON.stringify(updatedGoals));
      
      setNewGoal({
        title: '',
        description: '',
        type: 'score',
        target: '',
        timeframe: 'weekly',
        category: 'performance'
      });
      setShowCreateModal(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('neuroteach_goals', JSON.stringify(updatedGoals));
  };

  const getGoalIcon = (type) => {
    const icons = {
      score: 'fas fa-star',
      streak: 'fas fa-fire',
      sessions: 'fas fa-play-circle',
      time: 'fas fa-clock'
    };
    return icons[type] || 'fas fa-target';
  };

  const getGoalColor = (status, progress) => {
    if (status === 'completed') return 'success';
    if (status === 'near_completion') return 'warning';
    if (progress > 50) return 'info';
    return 'primary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      performance: 'fas fa-chart-line',
      consistency: 'fas fa-calendar-check',
      volume: 'fas fa-layer-group',
      time: 'fas fa-stopwatch'
    };
    return icons[category] || 'fas fa-bullseye';
  };

  const getTimeframeLabel = (timeframe) => {
    const labels = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      ongoing: 'Continuo'
    };
    return labels[timeframe] || timeframe;
  };

  const getMotivationalMessage = (goal) => {
    if (goal.status === 'completed') {
      return '¡Felicitaciones! Meta completada 🎉';
    }
    if (goal.progress >= 75) {
      return '¡Casi lo logras! Sigue así 💪';
    }
    if (goal.progress >= 50) {
      return 'Vas por buen camino 👍';
    }
    if (goal.progress >= 25) {
      return 'Buen comienzo, continúa 🚀';
    }
    return 'Comienza tu camino hacia la meta 🎯';
  };

  const goalTypes = [
    { value: 'score', label: 'Puntuación Promedio', unit: '%' },
    { value: 'streak', label: 'Racha de Días', unit: 'días' },
    { value: 'sessions', label: 'Número de Sesiones', unit: 'sesiones' },
    { value: 'time', label: 'Tiempo de Estudio', unit: 'minutos' }
  ];

  const categories = [
    { value: 'performance', label: 'Rendimiento' },
    { value: 'consistency', label: 'Consistencia' },
    { value: 'volume', label: 'Volumen' },
    { value: 'time', label: 'Tiempo' }
  ];

  const timeframes = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'ongoing', label: 'Continuo' }
  ];

  const activeGoals = goals.filter(goal => goal.status !== 'completed');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <div className="goals-tracker">
      <div className="goals-header">
        <h3 className="goals-title">
          <i className="fas fa-bullseye me-2"></i>
          Seguimiento de Metas
        </h3>
        <button 
          className="btn btn-primary create-goal-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus me-1"></i>
          Nueva Meta
        </button>
      </div>

      <div className="goals-content">
        {/* Metas Activas */}
        {activeGoals.length > 0 && (
          <div className="goals-section">
            <h5 className="section-title">
              <i className="fas fa-target me-2"></i>
              Metas Activas ({activeGoals.length})
            </h5>
            <div className="goals-grid">
              {activeGoals.map(goal => (
                <div key={goal.id} className={`goal-card ${goal.status}`}>
                  <div className="goal-header">
                    <div className="goal-info">
                      <div className="goal-icon">
                        <i className={getGoalIcon(goal.type)}></i>
                      </div>
                      <div className="goal-details">
                        <h6 className="goal-title">{goal.title}</h6>
                        <p className="goal-description">{goal.description}</p>
                      </div>
                    </div>
                    <div className="goal-actions">
                      <span className={`badge bg-${getCategoryIcon(goal.category).includes('chart') ? 'primary' : 'secondary'}`}>
                        <i className={getCategoryIcon(goal.category)} style={{fontSize: '0.7rem'}}></i>
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteGoal(goal.id)}
                        title="Eliminar meta"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-info">
                      <span className="progress-text">
                        {goal.current} / {goal.target} 
                        {goalTypes.find(t => t.value === goal.type)?.unit}
                      </span>
                      <span className={`progress-percentage text-${getGoalColor(goal.status, goal.progress)}`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="progress">
                      <div 
                        className={`progress-bar bg-${getGoalColor(goal.status, goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                        role="progressbar"
                        aria-valuenow={goal.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="goal-footer">
                    <div className="goal-meta">
                      <span className="timeframe">
                        <i className="fas fa-calendar me-1"></i>
                        {getTimeframeLabel(goal.timeframe)}
                      </span>
                      <span className="created-date">
                        <i className="fas fa-clock me-1"></i>
                        {new Date(goal.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="motivational-message">
                      {getMotivationalMessage(goal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas Completadas */}
        {completedGoals.length > 0 && (
          <div className="goals-section">
            <h5 className="section-title">
              <i className="fas fa-trophy me-2 text-warning"></i>
              Metas Completadas ({completedGoals.length})
            </h5>
            <div className="completed-goals">
              {completedGoals.map(goal => (
                <div key={goal.id} className="completed-goal-card">
                  <div className="completed-goal-info">
                    <i className={`${getGoalIcon(goal.type)} text-success me-2`}></i>
                    <span className="completed-goal-title">{goal.title}</span>
                    <span className="completed-date">
                      Completada el {new Date(goal.updatedAt || goal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="completed-goal-actions">
                    <i className="fas fa-check-circle text-success"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {goals.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No tienes metas definidas</h5>
            <p className="text-muted">Crea tu primera meta para comenzar a seguir tu progreso</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Crear Primera Meta
            </button>
          </div>
        )}
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-plus-circle me-2"></i>
                Crear Nueva Meta
              </h5>
              <button 
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={e => { e.preventDefault(); handleCreateGoal(); }}>
                <div className="mb-3">
                  <label className="form-label">Título de la Meta *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newGoal.title}
                    onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="Ej: Mejorar mi puntuación promedio"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newGoal.description}
                    onChange={e => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe tu meta en detalle"
                  ></textarea>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Meta *</label>
                    <select
                      className="form-select"
                      value={newGoal.type}
                      onChange={e => setNewGoal({...newGoal, type: e.target.value})}
                      required
                    >
                      {goalTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Objetivo *</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={newGoal.target}
                        onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                        placeholder="Ej: 85"
                        min="1"
                        required
                      />
                      <span className="input-group-text">
                        {goalTypes.find(t => t.value === newGoal.type)?.unit}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Categoría</label>
                    <select
                      className="form-select"
                      value={newGoal.category}
                      onChange={e => setNewGoal({...newGoal, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Plazo</label>
                    <select
                      className="form-select"
                      value={newGoal.timeframe}
                      onChange={e => setNewGoal({...newGoal, timeframe: e.target.value})}
                    >
                      {timeframes.map(tf => (
                        <option key={tf.value} value={tf.value}>
                          {tf.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleCreateGoal}
                disabled={loading || !newGoal.title || !newGoal.target}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-1"></i>
                    Crear Meta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalsTracker;