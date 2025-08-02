import React, { useState } from 'react';
import './AdvancedFilters.css';

function AdvancedFilters({ onFiltersChange, loading }) {
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    topics: [],
    emotions: [],
    scoreRange: {
      min: 0,
      max: 100
    },
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const availableTopics = [
    'Matemáticas', 'Ciencias', 'Historia', 'Literatura', 'Idiomas',
    'Programación', 'Arte', 'Música', 'Filosofía', 'Psicología'
  ];

  const availableEmotions = [
    'feliz', 'motivado', 'concentrado', 'neutral', 'confundido',
    'frustrado', 'aburrido', 'triste', 'ansioso', 'relajado'
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (filterType, item) => {
    const currentArray = filters[filterType];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    handleFilterChange(filterType, newArray);
  };

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: { start: '', end: '' },
      topics: [],
      emotions: [],
      scoreRange: { min: 0, max: 100 },
      sortBy: 'date',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.topics.length > 0) count++;
    if (filters.emotions.length > 0) count++;
    if (filters.scoreRange.min > 0 || filters.scoreRange.max < 100) count++;
    return count;
  };

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <button
          className="btn btn-outline-primary filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={loading}
        >
          <i className={`fas fa-filter me-2`}></i>
          Filtros Avanzados
          {getActiveFiltersCount() > 0 && (
            <span className="badge bg-primary ms-2">{getActiveFiltersCount()}</span>
          )}
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
        </button>
        
        {getActiveFiltersCount() > 0 && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={clearFilters}
            disabled={loading}
          >
            <i className="fas fa-times me-1"></i>
            Limpiar
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="row g-3">
            {/* Filtro de Fechas */}
            <div className="col-md-6">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-calendar me-2"></i>
                  Rango de Fechas
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value
                      })}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtro de Puntuación */}
            <div className="col-md-6">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-star me-2"></i>
                  Rango de Puntuación: {filters.scoreRange.min}% - {filters.scoreRange.max}%
                </label>
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="100"
                      value={filters.scoreRange.min}
                      onChange={(e) => handleFilterChange('scoreRange', {
                        ...filters.scoreRange,
                        min: parseInt(e.target.value)
                      })}
                      disabled={loading}
                    />
                    <small className="text-muted">Mínimo</small>
                  </div>
                  <div className="col-6">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="100"
                      value={filters.scoreRange.max}
                      onChange={(e) => handleFilterChange('scoreRange', {
                        ...filters.scoreRange,
                        max: parseInt(e.target.value)
                      })}
                      disabled={loading}
                    />
                    <small className="text-muted">Máximo</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtro de Temas */}
            <div className="col-md-6">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-book me-2"></i>
                  Temas ({filters.topics.length} seleccionados)
                </label>
                <div className="filter-chips">
                  {availableTopics.map(topic => (
                    <button
                      key={topic}
                      className={`chip ${filters.topics.includes(topic) ? 'chip-selected' : ''}`}
                      onClick={() => handleArrayFilterChange('topics', topic)}
                      disabled={loading}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtro de Emociones */}
            <div className="col-md-6">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-smile me-2"></i>
                  Emociones ({filters.emotions.length} seleccionadas)
                </label>
                <div className="filter-chips">
                  {availableEmotions.map(emotion => (
                    <button
                      key={emotion}
                      className={`chip ${filters.emotions.includes(emotion) ? 'chip-selected' : ''}`}
                      onClick={() => handleArrayFilterChange('emotions', emotion)}
                      disabled={loading}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="col-md-12">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="fas fa-sort me-2"></i>
                  Ordenar por
                </label>
                <div className="row g-2">
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      disabled={loading}
                    >
                      <option value="date">Fecha</option>
                      <option value="score">Puntuación</option>
                      <option value="topic">Tema</option>
                      <option value="emotion">Emoción</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={filters.sortOrder}
                      onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      disabled={loading}
                    >
                      <option value="desc">Descendente</option>
                      <option value="asc">Ascendente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;