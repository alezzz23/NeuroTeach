import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import InteractiveExerciseRenderer from './interactive/InteractiveExerciseRenderer';
import './Lesson.css';

function Lesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    fetchLessonData();
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Obtener datos de la lección
      const lessonResponse = await fetch(`http://localhost:3000/courses/${courseId}/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!lessonResponse.ok) {
        throw new Error('Error al cargar la lección');
      }
      
      const lessonData = await lessonResponse.json();
      setLesson(lessonData);
      setCourse(lessonData.course);
      
      // Obtener progreso del usuario
      const progressResponse = await fetch(`http://localhost:3000/courses/${courseId}/lessons/${lessonId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setUserProgress(progressData);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (exerciseResult = null) => {
    try {
      setCompleting(true);
      const token = getToken();
      
      const requestBody = exerciseResult ? {
        score: exerciseResult.score,
        exerciseType: exerciseResult.exerciseType,
        attempts: exerciseResult.attempts,
        timeSpent: exerciseResult.timeSpent
      } : {};
      
      const response = await fetch(`http://localhost:3000/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Error al marcar la lección como completada');
      }
      
      const result = await response.json();
      setUserProgress({ ...userProgress, completed: true, completedAt: new Date() });
      
      // Mostrar mensaje de éxito
      const scoreMessage = exerciseResult ? ` con una puntuación de ${exerciseResult.score}%` : '';
      alert(`¡Felicidades! Has completado la lección${scoreMessage} y ganado ${lesson.pointsReward} puntos.`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setCompleting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'success';
      case 'INTERMEDIATE': return 'warning';
      case 'ADVANCED': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'Principiante';
      case 'INTERMEDIATE': return 'Intermedio';
      case 'ADVANCED': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'VIDEO': return 'Video';
      case 'TEXT': return 'Lectura';
      case 'INTERACTIVE': return 'Interactivo';
      case 'QUIZ': return 'Cuestionario';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="lesson-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando lección...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-container">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/courses`)}>
          <i className="fas fa-arrow-left me-2"></i>
          Volver a Cursos
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-container">
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Lección no encontrada
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/courses`)}>
          <i className="fas fa-arrow-left me-2"></i>
          Volver a Cursos
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0" onClick={() => navigate('/courses')}>
              <i className="fas fa-book me-1"></i>
              Cursos
            </button>
          </li>
          <li className="breadcrumb-item">
            <button className="btn btn-link p-0" onClick={() => navigate(`/courses`)}>
              {course?.title}
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {lesson.title}
          </li>
        </ol>
      </nav>

      {/* Lesson Header */}
      <div className="lesson-header">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="lesson-meta mb-2">
              <span className="badge bg-primary me-2">
                Lección {lesson.order}
              </span>
              <span className={`badge bg-${getDifficultyColor(lesson.difficulty)} me-2`}>
                {getDifficultyText(lesson.difficulty)}
              </span>
              <span className="badge bg-info me-2">
                {getTypeText(lesson.type)}
              </span>
              {userProgress?.completed && (
                <span className="badge bg-success">
                  <i className="fas fa-check me-1"></i>
                  Completada
                </span>
              )}
            </div>
            <h1 className="lesson-title">{lesson.title}</h1>
            <div className="lesson-stats">
              <span className="stat">
                <i className="fas fa-clock me-1"></i>
                {lesson.estimatedTime} min
              </span>
              <span className="stat">
                <i className="fas fa-star me-1"></i>
                {lesson.pointsReward} puntos
              </span>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            {!userProgress?.completed && (
              <button 
                className="btn btn-success btn-lg"
                onClick={markAsCompleted}
                disabled={completing}
              >
                {completing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Completando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Marcar como Completada
                  </>
                )}
              </button>
            )}
            {userProgress?.completed && (
              <div className="completed-info">
                <i className="fas fa-check-circle text-success fs-1"></i>
                <p className="text-success mt-2 mb-0">
                  <strong>¡Completada!</strong>
                </p>
                <small className="text-muted">
                  {new Date(userProgress.completedAt).toLocaleDateString()}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="lesson-content">
        <div className="content-card">
          <div className="content-body">
            {lesson.type === 'VIDEO' && (
              <div className="video-placeholder">
                <div className="video-icon">
                  <i className="fas fa-play-circle"></i>
                </div>
                <h4>Contenido de Video</h4>
                <p className="text-muted">Aquí se mostraría el reproductor de video</p>
              </div>
            )}
            
            {lesson.type === 'INTERACTIVE' && (
              <div className="interactive-content">
                {lesson.interactiveContent ? (
                  <InteractiveExerciseRenderer 
                    lesson={lesson} 
                    onComplete={markAsCompleted}
                  />
                ) : (
                  <div className="interactive-placeholder">
                    <div className="interactive-icon">
                      <i className="fas fa-mouse-pointer"></i>
                    </div>
                    <h4>Contenido Interactivo</h4>
                    <p className="text-muted">Este ejercicio interactivo aún no está configurado</p>
                  </div>
                )}
              </div>
            )}
            
            {lesson.type === 'QUIZ' && (
              <div className="quiz-placeholder">
                <div className="quiz-icon">
                  <i className="fas fa-question-circle"></i>
                </div>
                <h4>Cuestionario</h4>
                <p className="text-muted">Aquí se mostraría el cuestionario</p>
              </div>
            )}
            
            <div className="lesson-text">
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="lesson-navigation">
        <div className="row">
          <div className="col-6">
            <button className="btn btn-outline-primary" onClick={() => navigate('/courses')}>
              <i className="fas fa-arrow-left me-2"></i>
              Volver al Curso
            </button>
          </div>
          <div className="col-6 text-end">
            {!userProgress?.completed && (
              <button 
                className="btn btn-primary"
                onClick={markAsCompleted}
                disabled={completing}
              >
                {completing ? 'Completando...' : 'Completar Lección'}
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lesson;