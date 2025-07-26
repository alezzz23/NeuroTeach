import React, { useState } from 'react';
import './InteractiveExercise.css';

function CodeExercise({ exercise, onComplete }) {
  const [code, setCode] = useState(exercise.starterCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Simular ejecución de código
      // En una implementación real, esto se enviaría a un backend seguro
      const results = await simulateCodeExecution(code, exercise.testCases);
      setTestResults(results);
      
      const passed = results.every(result => result.passed);
      setAllTestsPassed(passed);
      
      if (passed) {
        setOutput('¡Todos los tests pasaron! ✅\n\n' + results.map(r => `✓ ${r.description}`).join('\n'));
        
        // Calcular puntuación basada en la calidad del código
        const score = calculateCodeScore(code, exercise);
        
        setTimeout(() => {
          onComplete({
            score,
            correct: true,
            attempts: 1,
            timeSpent: 0
          });
        }, 1500);
      } else {
        const failedTests = results.filter(r => !r.passed);
        setOutput('Algunos tests fallaron: ❌\n\n' + 
          failedTests.map(r => `✗ ${r.description}: ${r.error}`).join('\n'));
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const simulateCodeExecution = async (userCode, testCases) => {
    // Simulación simple de ejecución de código
    // En producción, esto debería ejecutarse en un entorno seguro
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Crear una función a partir del código del usuario
        const func = new Function('return ' + userCode)();
        const result = func(...testCase.input);
        
        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
        results.push({
          description: testCase.description,
          passed,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          error: passed ? null : `Esperado: ${JSON.stringify(testCase.expected)}, Obtenido: ${JSON.stringify(result)}`
        });
      } catch (error) {
        results.push({
          description: testCase.description,
          passed: false,
          error: error.message
        });
      }
    }
    
    return results;
  };

  const calculateCodeScore = (userCode, exercise) => {
    let score = 80; // Puntuación base por pasar todos los tests
    
    // Bonificaciones por buenas prácticas
    if (userCode.includes('//') || userCode.includes('/*')) {
      score += 5; // Comentarios
    }
    
    if (userCode.length <= exercise.maxLength) {
      score += 10; // Código conciso
    }
    
    if (!userCode.includes('console.log') && exercise.type !== 'debug') {
      score += 5; // Sin debug prints innecesarios
    }
    
    return Math.min(score, 100);
  };

  const resetCode = () => {
    setCode(exercise.starterCode || '');
    setOutput('');
    setTestResults([]);
    setAllTestsPassed(false);
    setShowSolution(false);
  };

  return (
    <div className="interactive-exercise code-exercise">
      <div className="exercise-header">
        <h3>{exercise.title}</h3>
        <div className="exercise-meta">
          <span className="badge bg-info me-2">
            <i className="fas fa-code me-1"></i>
            {exercise.language || 'JavaScript'}
          </span>
          <span className="badge bg-secondary">
            <i className="fas fa-clock me-1"></i>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      <div className="exercise-content">
        <div className="problem-description">
          <h5>Descripción del Problema:</h5>
          <p>{exercise.description}</p>
          
          {exercise.examples && (
            <div className="examples-section">
              <h6>Ejemplos:</h6>
              {exercise.examples.map((example, index) => (
                <div key={index} className="example">
                  <strong>Entrada:</strong> <code>{JSON.stringify(example.input)}</code><br/>
                  <strong>Salida:</strong> <code>{JSON.stringify(example.output)}</code>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="code-editor-section">
          <div className="editor-header">
            <h6>Tu Código:</h6>
            <div className="editor-actions">
              <button 
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={resetCode}
              >
                <i className="fas fa-undo me-1"></i>
                Reset
              </button>
              <button 
                className="btn btn-sm btn-outline-info"
                onClick={() => setShowSolution(!showSolution)}
              >
                <i className="fas fa-eye me-1"></i>
                {showSolution ? 'Ocultar' : 'Ver'} Solución
              </button>
            </div>
          </div>
          
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Escribe tu código aquí..."
            rows={12}
            spellCheck={false}
          />
          
          {showSolution && exercise.solution && (
            <div className="solution-section">
              <h6>Solución de Ejemplo:</h6>
              <pre className="solution-code">{exercise.solution}</pre>
            </div>
          )}
        </div>

        <div className="test-section">
          <div className="test-header">
            <h6>Tests:</h6>
            <button
              className="btn btn-primary"
              onClick={runCode}
              disabled={isRunning || !code.trim()}
            >
              {isRunning ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Ejecutando...
                </>
              ) : (
                <>
                  <i className="fas fa-play me-2"></i>
                  Ejecutar Tests
                </>
              )}
            </button>
          </div>
          
          {testResults.length > 0 && (
            <div className="test-results">
              {testResults.map((result, index) => (
                <div key={index} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                  <div className="test-status">
                    <i className={`fas ${result.passed ? 'fa-check' : 'fa-times'}`}></i>
                  </div>
                  <div className="test-details">
                    <strong>{result.description}</strong>
                    {!result.passed && result.error && (
                      <div className="error-message">{result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {output && (
            <div className="output-section">
              <h6>Resultado:</h6>
              <pre className="output">{output}</pre>
            </div>
          )}
        </div>

        {allTestsPassed && (
          <div className="success-message">
            <div className="alert alert-success">
              <i className="fas fa-trophy me-2"></i>
              ¡Excelente! Has resuelto el ejercicio correctamente.
            </div>
          </div>
        )}

        <div className="exercise-actions">
          {allTestsPassed ? (
            <button
              className="btn btn-success btn-lg"
              onClick={() => onComplete({
                score: calculateCodeScore(code, exercise),
                correct: true,
                attempts: 1,
                timeSpent: 0
              })}
            >
              <i className="fas fa-arrow-right me-2"></i>
              Continuar
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={resetCode}
              >
                <i className="fas fa-redo me-2"></i>
                Reiniciar
              </button>
              <button
                className="btn btn-outline-info"
                onClick={() => setShowSolution(!showSolution)}
              >
                <i className="fas fa-lightbulb me-2"></i>
                Ayuda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeExercise;