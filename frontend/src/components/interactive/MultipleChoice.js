import React, { useState } from 'react';
import './InteractiveExercise.css';

function MultipleChoice({ exercise, onComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Calcular puntuación
    const score = correct ? 100 : 0;
    
    // Llamar callback con resultado
    setTimeout(() => {
      onComplete({
        score,
        correct,
        attempts: 1,
        timeSpent: 0 // Se puede implementar un timer
      });
    }, 2000);
  };

  const resetExercise = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="interactive-exercise multiple-choice">
      <div className="exercise-header">
        <h3>{exercise.question}</h3>
        {exercise.description && (
          <p className="exercise-description">{exercise.description}</p>
        )}
      </div>

      <div className="exercise-content">
        <div className="options-container">
          {exercise.options.map((option, index) => (
            <div
              key={index}
              className={`option ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                showResult
                  ? index === exercise.correctAnswer
                    ? 'correct'
                    : selectedAnswer === index
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              onClick={() => !showResult && setSelectedAnswer(index)}
            >
              <div className="option-letter">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="option-text">{option}</div>
              {showResult && index === exercise.correctAnswer && (
                <i className="fas fa-check text-success ms-auto"></i>
              )}
              {showResult && selectedAnswer === index && index !== exercise.correctAnswer && (
                <i className="fas fa-times text-danger ms-auto"></i>
              )}
            </div>
          ))}
        </div>

        {showResult && (
          <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">
              <i className={`fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            </div>
            <div className="result-message">
              <h4>{isCorrect ? '¡Correcto!' : 'Incorrecto'}</h4>
              <p>
                {isCorrect
                  ? exercise.correctFeedback || '¡Excelente trabajo!'
                  : exercise.incorrectFeedback || `La respuesta correcta es: ${exercise.options[exercise.correctAnswer]}`
                }
              </p>
            </div>
          </div>
        )}

        <div className="exercise-actions">
          {!showResult ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              <i className="fas fa-check me-2"></i>
              Verificar Respuesta
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={resetExercise}
              >
                <i className="fas fa-redo me-2"></i>
                Intentar de Nuevo
              </button>
              <button
                className="btn btn-success"
                onClick={() => onComplete({
                  score: isCorrect ? 100 : 0,
                  correct: isCorrect,
                  attempts: 1,
                  timeSpent: 0
                })}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MultipleChoice;