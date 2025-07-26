import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Courses.css';

function Courses() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch('http://localhost:3000/courses/my-progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los cursos');
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      setEnrolling(true);
      setError(null); // Limpiar errores previos
      
      const token = getToken();
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      console.log('Enrolling in course:', courseId);
      
      const response = await fetch(`http://localhost:3000/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Enrollment response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Enrollment error:', errorData);
        throw new Error(`Error al inscribirse en el curso: ${response.status}`);
      }

      const result = await response.json();
      console.log('Enrollment successful:', result);
      
      // Actualizar la lista de cursos
      await fetchCourses();
      setSelectedCourse(null);
      
      // Mostrar mensaje de éxito
      alert('¡Te has inscrito exitosamente en el curso!');
      
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'mathematics': return 'fa-calculator';
      case 'science': return 'fa-flask';
      case 'language': return 'fa-book';
      case 'history': return 'fa-landmark';
      case 'art': return 'fa-palette';
      case 'music': return 'fa-music';
      case 'geography': return 'fa-globe';
      case 'programming': return 'fa-code';
      case 'english': return 'fa-language';
      default: return 'fa-graduation-cap';
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2>
          <i className="fas fa-graduation-cap me-2"></i>
          Cursos Disponibles
        </h2>
        <p className="text-muted">Explora y aprende con nuestros cursos interactivos</p>
      </div>

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 mb-4">
            <div className="course-card">
              <div className="course-header">
                <div className="course-icon">
                  <i className={`fas ${getCategoryIcon(course.category)}`}></i>
                </div>
                <div className="course-meta">
                  <span className={`badge bg-${getDifficultyColor(course.difficulty)}`}>
                    {getDifficultyText(course.difficulty)}
                  </span>
                </div>
              </div>

              <div className="course-body">
                <h5 className="course-title">{course.title}</h5>
                <p className="course-description">{course.description}</p>

                <div className="course-stats">
                  <div className="stat">
                    <i className="fas fa-clock text-muted"></i>
                    <span>{course.estimatedHours}h</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-book-open text-muted"></i>
                    <span>{course.lessons ? course.lessons.length : course.totalLessons || 0} lecciones</span>
                  </div>
                </div>

                {course.userProgress && (
                  <div className="progress-section">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Progreso</small>
                      <small className="text-muted">
                        {Math.round(course.userProgress.progress * 100)}%
                      </small>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${course.userProgress.progress * 100}%` }}
                        aria-valuenow={course.userProgress.progress * 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    {course.userProgress.isCompleted && (
                      <div className="mt-2">
                        <span className="badge bg-success">
                          <i className="fas fa-check me-1"></i>
                          Completado
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="course-footer">
                {course.userProgress ? (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <i className="fas fa-play me-2"></i>
                    Continuar Curso
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={(event) => enrollInCourse(course.id, event)}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Inscribiendo...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Inscribirse
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-graduation-cap"></i>
          <h4>No hay cursos disponibles</h4>
          <p>Los cursos estarán disponibles próximamente.</p>
        </div>
      )}

      {/* Modal para ver detalles del curso */}
      {selectedCourse && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas ${getCategoryIcon(selectedCourse.category)} me-2`}></i>
                  {selectedCourse.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCourse(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedCourse.description}</p>
                
                <h6>Lecciones del curso:</h6>
                <div className="lessons-list">
                  {selectedCourse.lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className="lesson-item"
                      onClick={() => navigate(`/courses/${selectedCourse.id}/lesson/${lesson.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="lesson-number">{index + 1}</div>
                      <div className="lesson-info">
                        <h6>{lesson.title}</h6>
                        <div className="lesson-meta">
                          <span className="badge bg-secondary me-2">
                            {lesson.type === 'theory' ? 'Teoría' : 
                             lesson.type === 'exercise' ? 'Ejercicio' : 
                             lesson.type === 'quiz' ? 'Quiz' : lesson.type}
                          </span>
                          <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            {lesson.estimatedMinutes} min
                          </small>
                        </div>
                      </div>
                      <div className="lesson-action">
                        <i className="fas fa-arrow-right text-primary"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedCourse(null)}
                >
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-play me-2"></i>
                  Comenzar Curso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedCourse && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Courses;