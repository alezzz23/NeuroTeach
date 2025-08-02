import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import './VirtualLabs.css';

const VirtualLabs = () => {
  const { user, getToken } = useAuth();
  const [labs, setLabs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  // Función para obtener laboratorios desde el backend
  const fetchLabs = async (category = 'all') => {
    try {
      const token = getToken();
      const url = category === 'all' 
        ? `${API_BASE_URL}/virtual-labs`
        : `${API_BASE_URL}/virtual-labs?category=${category}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const labsData = await response.json();
        setLabs(labsData);
      } else {
        console.error('Error al cargar laboratorios:', response.status);
        // Si falla la autenticación, usar datos mock como fallback
        if (response.status === 401) {
          console.log('Usando datos mock como fallback');
          setLabs(mockLabs);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // En caso de error, usar datos mock como fallback
      console.log('Usando datos mock como fallback debido a error');
      setLabs(mockLabs);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener estadísticas
  const fetchStatistics = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/virtual-labs/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const statsData = await response.json();
        setStatistics(statsData);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Datos mock de laboratorios para fallback
  const mockLabs = [
    {
      id: 1,
      title: 'Introducción a Python',
      description: 'Aprende los fundamentos de Python con ejercicios prácticos',
      category: 'programming',
      difficulty: 'beginner',
      duration: '30 min',
      technologies: ['Python'],
      objectives: [
        'Entender variables y tipos de datos',
        'Crear funciones básicas',
        'Trabajar con listas y diccionarios'
      ],
      status: 'available',
      completedBy: 0,
      rating: 4.8
    },
    {
      id: 2,
      title: 'HTML y CSS Básico',
      description: 'Construye tu primera página web desde cero',
      category: 'web-development',
      difficulty: 'beginner',
      duration: '45 min',
      technologies: ['HTML', 'CSS'],
      objectives: [
        'Crear estructura HTML semántica',
        'Aplicar estilos CSS',
        'Hacer diseño responsive'
      ],
      status: 'available',
      completedBy: 0,
      rating: 4.6
    },
    {
      id: 3,
      title: 'Consultas SQL Avanzadas',
      description: 'Domina las consultas complejas en bases de datos',
      category: 'database',
      difficulty: 'intermediate',
      duration: '60 min',
      technologies: ['SQL', 'PostgreSQL'],
      objectives: [
        'Realizar JOINs complejos',
        'Usar subconsultas',
        'Optimizar rendimiento'
      ],
      status: 'available',
      completedBy: 0,
      rating: 4.9
    },
    {
      id: 4,
      title: 'Docker Fundamentals',
      description: 'Aprende containerización con Docker',
      category: 'devops',
      difficulty: 'intermediate',
      duration: '90 min',
      technologies: ['Docker', 'Linux'],
      objectives: [
        'Crear contenedores Docker',
        'Escribir Dockerfiles',
        'Usar Docker Compose'
      ],
      status: 'coming-soon',
      completedBy: 0,
      rating: 0
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-th-large' },
    { id: 'programming', name: 'Programación', icon: 'fas fa-code' },
    { id: 'web-development', name: 'Desarrollo Web', icon: 'fas fa-globe' },
    { id: 'database', name: 'Bases de Datos', icon: 'fas fa-database' },
    { id: 'devops', name: 'DevOps', icon: 'fas fa-server' },
    { id: 'computer-science', name: 'Ciencias de la Computación', icon: 'fas fa-brain' }
  ];

  useEffect(() => {
    fetchLabs();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchLabs(selectedCategory);
  }, [selectedCategory]);

  // Los labs ya están filtrados por el backend
  const filteredLabs = labs;

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
      default: return 'No definido';
    }
  };

  const handleStartLab = (labId) => {
    // Redirigir al entorno del laboratorio
    window.location.href = `/virtual-labs/${labId}`;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <i className="fas fa-flask me-2 text-primary"></i>
                Laboratorios Virtuales
              </h2>
              <p className="text-muted mb-0">
                Practica con entornos reales y mejora tus habilidades técnicas
              </p>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-primary me-2">
                {filteredLabs.length} laboratorios disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <i className="fas fa-filter me-2"></i>
                Filtrar por categoría
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`btn ${
                      selectedCategory === category.id 
                        ? 'btn-primary' 
                        : 'btn-outline-primary'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <i className={`${category.icon} me-2`}></i>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de laboratorios */}
      <div className="row">
        {filteredLabs.map(lab => (
          <div key={lab.id} className="col-lg-6 col-xl-4 mb-4">
            <div className="card h-100 lab-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className={`badge bg-${getDifficultyColor(lab.difficulty)} me-2`}>
                    {getDifficultyText(lab.difficulty)}
                  </span>
                  <small className="text-muted">
                    <i className="fas fa-clock me-1"></i>
                    {lab.duration}
                  </small>
                </div>
                {lab.status === 'coming-soon' && (
                  <span className="badge bg-secondary">Próximamente</span>
                )}
              </div>
              
              <div className="card-body">
                <h5 className="card-title">{lab.title}</h5>
                <p className="card-text text-muted">{lab.description}</p>
                
                {/* Tecnologías */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Tecnologías:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {lab.technologies.map((tech, index) => (
                      <span key={index} className="badge bg-light text-dark">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Objetivos */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Objetivos:</small>
                  <ul className="list-unstyled small">
                    {lab.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="mb-1">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {objective}
                      </li>
                    ))}
                    {lab.objectives.length > 2 && (
                      <li className="text-muted">
                        <i className="fas fa-plus me-2"></i>
                        +{lab.objectives.length - 2} más
                      </li>
                    )}
                  </ul>
                </div>

                {/* Rating y estadísticas */}
                {lab.rating > 0 && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <i className="fas fa-star text-warning me-1"></i>
                      <span className="small">{lab.rating}</span>
                    </div>
                    <div className="small text-muted">
                      {lab.completedBy} completados
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button 
                  className={`btn w-100 ${
                    lab.status === 'available' 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                  disabled={lab.status !== 'available'}
                  onClick={() => handleStartLab(lab.id)}
                >
                  {lab.status === 'available' ? (
                    <>
                      <i className="fas fa-play me-2"></i>
                      Iniciar Laboratorio
                    </>
                  ) : (
                    <>
                      <i className="fas fa-clock me-2"></i>
                      Próximamente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay laboratorios */}
      {filteredLabs.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <i className="fas fa-flask fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No hay laboratorios disponibles</h4>
              <p className="text-muted">
                No se encontraron laboratorios para la categoría seleccionada.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualLabs;