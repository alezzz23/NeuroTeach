import React from 'react';
import MultipleChoice from './MultipleChoice';
import FillInTheBlanks from './FillInTheBlanks';
import CodeExercise from './CodeExercise';
import './InteractiveExercise.css';

function InteractiveExerciseRenderer({ lesson, onComplete }) {
  // Verificar si la lección tiene contenido interactivo
  if (!lesson.interactiveContent) {
    return (
      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Esta lección no tiene ejercicios interactivos disponibles.
      </div>
    );
  }

  const { type, exercise } = lesson.interactiveContent;

  const handleExerciseComplete = (result) => {
    // Llamar al callback con los resultados del ejercicio
    onComplete({
      lessonId: lesson.id,
      exerciseType: type,
      score: result.score,
      correct: result.correct,
      attempts: result.attempts,
      timeSpent: result.timeSpent,
      completedAt: new Date().toISOString()
    });
  };

  // Renderizar el componente apropiado según el tipo de ejercicio
  switch (type) {
    case 'multiple_choice':
      return (
        <MultipleChoice 
          exercise={exercise} 
          onComplete={handleExerciseComplete}
        />
      );
    
    case 'fill_blanks':
      return (
        <FillInTheBlanks 
          exercise={exercise} 
          onComplete={handleExerciseComplete}
        />
      );
    
    case 'code':
      return (
        <CodeExercise 
          exercise={exercise} 
          onComplete={handleExerciseComplete}
        />
      );
    
    default:
      return (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Tipo de ejercicio no reconocido: {type}
        </div>
      );
  }
}

export default InteractiveExerciseRenderer;