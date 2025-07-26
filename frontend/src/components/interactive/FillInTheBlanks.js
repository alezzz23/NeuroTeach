import React, { useState } from 'react';
import './InteractiveExercise.css';

function FillInTheBlanks({ exercise, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState({});

  const handleInputChange = (blankIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [blankIndex]: value
    }));
  };

  const handleSubmit = () => {
    const newResults = {};
    let correctCount = 0;
    
    exercise.blanks.forEach((blank, index) => {
      const userAnswer = (answers[index] || '').trim().toLowerCase();
      const correctAnswers = blank.acceptedAnswers.map(ans => ans.toLowerCase());
      const isCorrect = correctAnswers.includes(userAnswer);
      
      newResults[index] = {
        isCorrect,
        userAnswer: answers[index] || '',
        correctAnswer: blank.acceptedAnswers[0]
      };
      
      if (isCorrect) correctCount++;
    });
    
    setResults(newResults);
    setShowResult(true);
    
    // Calcular puntuación
    const score = Math.round((correctCount / exercise.blanks.length) * 100);
    
    // Llamar callback con resultado
    setTimeout(() => {
      onComplete({
        score,
        correct: score >= 70, // 70% para considerar correcto
        attempts: 1,
        timeSpent: 0
      });
    }, 2000);
  };

  const resetExercise = () => {
    setAnswers({});
    setShowResult(false);
    setResults({});
  };

  const renderTextWithBlanks = () => {
    let text = exercise.text;
    let blankIndex = 0;
    
    // Reemplazar marcadores de espacios en blanco con inputs
    const parts = text.split(/\{\{\s*blank\s*\}\}/gi);
    const result = [];
    
    parts.forEach((part, index) => {
      result.push(<span key={`text-${index}`}>{part}</span>);
      
      if (index < parts.length - 1) {
        const currentBlankIndex = blankIndex;
        result.push(
          <span key={`blank-${currentBlankIndex}`} className="blank-container">
            <input
              type="text"
              className={`blank-input ${
                showResult
                  ? results[currentBlankIndex]?.isCorrect
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              value={answers[currentBlankIndex] || ''}
              onChange={(e) => handleInputChange(currentBlankIndex, e.target.value)}
              disabled={showResult}
              placeholder="..."
            />
            {showResult && (
              <span className="blank-feedback">
                {results[currentBlankIndex]?.isCorrect ? (
                  <i className="fas fa-check text-success"></i>
                ) : (
                  <span className="correction">
                    <i className="fas fa-times text-danger"></i>
                    <small className="correct-answer">
                      {results[currentBlankIndex]?.correctAnswer}
                    </small>
                  </span>
                )}
              </span>
            )}
          </span>
        );
        blankIndex++;
      }
    });
    
    return result;
  };

  const allAnswered = exercise.blanks.every((_, index) => 
    answers[index] && answers[index].trim() !== ''
  );

  const correctCount = Object.values(results).filter(r => r.isCorrect).length;
  const totalBlanks = exercise.blanks.length;

  return (
    <div className="interactive-exercise fill-blanks">
      <div className="exercise-header">
        <h3>{exercise.title}</h3>
        {exercise.instructions && (
          <p className="exercise-instructions">{exercise.instructions}</p>
        )}
      </div>

      <div className="exercise-content">
        <div className="text-with-blanks">
          {renderTextWithBlanks()}
        </div>

        {exercise.hints && exercise.hints.length > 0 && (
          <div className="hints-section">
            <h5><i className="fas fa-lightbulb me-2"></i>Pistas:</h5>
            <ul className="hints-list">
              {exercise.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {showResult && (
          <div className="result-summary">
            <div className="score-display">
              <h4>
                <i className="fas fa-chart-line me-2"></i>
                Puntuación: {correctCount}/{totalBlanks}
              </h4>
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${(correctCount / totalBlanks) * 100}%` }}
                ></div>
              </div>
            </div>
            {exercise.feedback && (
              <div className="exercise-feedback">
                <p>{exercise.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="exercise-actions">
          {!showResult ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              <i className="fas fa-check me-2"></i>
              Verificar Respuestas
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
                  score: Math.round((correctCount / totalBlanks) * 100),
                  correct: correctCount >= Math.ceil(totalBlanks * 0.7),
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

export default FillInTheBlanks;