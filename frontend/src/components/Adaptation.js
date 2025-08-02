import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import './Adaptation.css';

function Adaptation() {
  const { getToken } = useAuth();
  const [emotion, setEmotion] = useState('');
  const [performance, setPerformance] = useState('');
  const [learningStyle, setLearningStyle] = useState('visual');
  const [timeSpent, setTimeSpent] = useState('');
  const [attempts, setAttempts] = useState('1');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    const token = getToken();
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/adaptation/recommend`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          emotion, 
          performance: Number(performance),
          learningStyle,
          timeSpent: timeSpent ? parseInt(timeSpent) : 0,
          attempts: parseInt(attempts)
        })
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al conectar con el backend');
      setResult({
        action: 'error',
        message: 'Error al conectar con el servidor.',
        difficulty: 'normal',
        strategy: 'revision',
        resources: [],
        estimatedTime: 0,
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'muy_facil': '#4CAF50',
      'facil': '#8BC34A',
      'normal': '#FFC107',
      'dificil': '#FF9800',
      'muy_dificil': '#F44336'
    };
    return colors[difficulty] || '#9E9E9E';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FFC107';
    return '#FF9800';
  };

  return (
    <div className="adaptation-container">
      <div className="adaptation-header">
        <h2>🧠 Adaptación Pedagógica Inteligente</h2>
        <p>Sistema avanzado de personalización del aprendizaje basado en IA</p>
      </div>
      
      <form onSubmit={handleSend} className="adaptation-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emotion">😊 Estado Emocional:</label>
            <select
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              required
            >
              <option value="">Selecciona tu estado</option>
              <option value="feliz">😊 Feliz</option>
              <option value="motivado">🚀 Motivado</option>
              <option value="concentrado">🎯 Concentrado</option>
              <option value="frustrado">😤 Frustrado</option>
              <option value="aburrido">😴 Aburrido</option>
              <option value="confundido">🤔 Confundido</option>
              <option value="ansioso">😰 Ansioso</option>
              <option value="cansado">😪 Cansado</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="performance">📊 Rendimiento (0-100):</label>
            <input
              type="number"
              id="performance"
              min="0"
              max="100"
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
              placeholder="Ej: 75"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="learningStyle">🎨 Estilo de Aprendizaje:</label>
            <select
              id="learningStyle"
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
            >
              <option value="visual">👁️ Visual</option>
              <option value="auditivo">👂 Auditivo</option>
              <option value="kinestesico">🤲 Kinestésico</option>
              <option value="lectoescritor">📚 Lectoescritor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeSpent">⏱️ Tiempo Estudiado (minutos):</label>
            <input
              type="number"
              id="timeSpent"
              min="0"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="Ej: 30"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="attempts">🔄 Número de Intentos:</label>
            <input
              type="number"
              id="attempts"
              min="1"
              max="10"
              value={attempts}
              onChange={(e) => setAttempts(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <span className="spinner"></span>
              Analizando con IA...
            </>
          ) : (
            <>
              🤖 Obtener Recomendación Personalizada
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="recommendation-panel">
          <div className="recommendation-header">
            <h3>🎯 Recomendación Personalizada</h3>
            <div className="confidence-badge" style={{backgroundColor: getConfidenceColor(result.confidence)}}>
              Confianza: {Math.round(result.confidence * 100)}%
            </div>
          </div>
          
          <div className="recommendation-content">
            <div className="main-message">
              <h4>💬 Mensaje Principal:</h4>
              <p className="message-text">{result.message}</p>
            </div>
            
            <div className="recommendation-details">
              <div className="detail-card">
                <h5>🎯 Acción Recomendada:</h5>
                <span className="action-badge">{result.action}</span>
              </div>
              
              <div className="detail-card">
                <h5>📈 Nivel de Dificultad:</h5>
                <span 
                  className="difficulty-badge" 
                  style={{backgroundColor: getDifficultyColor(result.difficulty)}}
                >
                  {result.difficulty.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="detail-card">
                <h5>🧩 Estrategia:</h5>
                <span className="strategy-badge">{result.strategy}</span>
              </div>
              
              <div className="detail-card">
                <h5>⏰ Tiempo Estimado:</h5>
                <span className="time-badge">{result.estimatedTime} minutos</span>
              </div>
            </div>
            
            {result.resources && result.resources.length > 0 && (
              <div className="resources-section">
                <h5>📚 Recursos Recomendados:</h5>
                <div className="resources-grid">
                  {result.resources.map((resource, index) => (
                    <span key={index} className="resource-tag">
                      {resource.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
    </div>
  );
}

export default Adaptation;