import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import './LabEnvironment.css';

const LabEnvironment = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hints, setHints] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const terminalRef = useRef(null);

  // Función para obtener el laboratorio desde el backend
  const fetchLab = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/virtual-labs/${labId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const labData = await response.json();
        setLab(labData);
        
        // Cargar progreso del usuario
        await fetchUserProgress(labData.id);
        
        // Establecer código inicial del primer paso
        if (labData.steps && labData.steps.length > 0) {
          setCode(labData.steps[0].initialCode || '');
          setHints(labData.steps[0].hints || []);
        }
      } else {
        console.error('Error al cargar el laboratorio');
        navigate('/virtual-labs');
      }
    } catch (error) {
      console.error('Error al cargar el laboratorio:', error);
      navigate('/virtual-labs');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar progreso del usuario
  const fetchUserProgress = async (labId) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/virtual-labs/${labId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const progressData = await response.json();
        setUserProgress(progressData);
        if (progressData.currentStep !== undefined) {
          setCurrentStep(progressData.currentStep);
        }
        if (progressData.progress !== undefined) {
          setProgress(progressData.progress);
        }
      }
    } catch (error) {
      console.error('Error al cargar progreso:', error);
    }
  };

  // Función para guardar progreso
  const saveProgress = async (stepData) => {
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/virtual-labs/${labId}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stepData)
      });
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  };

  useEffect(() => {
    fetchLab();
  }, [labId]);

  useEffect(() => {
    if (lab && lab.steps[currentStep]) {
      setCode(lab.steps[currentStep].initialCode);
      setHints(lab.steps[currentStep].hints);
      setValidationResult(null);
      setTerminalOutput('');
    }
  }, [currentStep, lab]);

  const runCode = async () => {
    setIsRunning(true);
    setTerminalOutput('Ejecutando código...');
    
    try {
      // Simular ejecución de código
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validar código
      const currentStepData = lab.steps[currentStep];
      const validation = validateCode(code, currentStepData.validation);
      
      setValidationResult(validation);
      
      if (validation.success) {
        setTerminalOutput(`✅ ¡Excelente! Has completado este paso correctamente.\n\n${validation.message}`);
        
        // Guardar progreso
        const newProgress = Math.round(((currentStep + 1) / lab.steps.length) * 100);
        setProgress(newProgress);
        
        await saveProgress({
          currentStep: currentStep + 1,
          progress: newProgress,
          completedAt: new Date().toISOString()
        });
      } else {
        setTerminalOutput(`❌ ${validation.message}\n\nRevisa tu código e inténtalo de nuevo.`);
      }
    } catch (error) {
      setTerminalOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const validateCode = (code, validation) => {
    if (!validation || !validation.checks) {
      return { success: true, message: 'Código ejecutado correctamente' };
    }

    const errors = [];
    
    validation.checks.forEach(check => {
      switch (check.type) {
        case 'variable_exists':
          if (!code.includes(check.name)) {
            errors.push(`Falta la variable '${check.name}'`);
          }
          break;
        case 'function_called':
          if (!code.includes(`${check.name}(`)) {
            errors.push(`Debes llamar a la función '${check.name}()'`);
          }
          break;
        case 'function_defined':
          if (!code.includes(`def ${check.name}`)) {
            errors.push(`Debes definir la función '${check.name}'`);
          }
          break;
        case 'keyword_used':
          if (!code.includes(check.name)) {
            errors.push(`Debes usar la palabra clave '${check.name}'`);
          }
          break;
        case 'method_called':
          if (!code.includes(`.${check.name}(`)) {
            errors.push(`Debes usar el método '${check.name}()'`);
          }
          break;
      }
    });

    if (errors.length > 0) {
      return {
        success: false,
        message: errors.join('\n')
      };
    }

    return {
      success: true,
      message: '¡Perfecto! Tu código cumple con todos los requisitos.'
    };
  };

  const nextStep = () => {
    if (currentStep < lab.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCode = () => {
    if (lab && lab.steps[currentStep]) {
      setCode(lab.steps[currentStep].initialCode);
      setTerminalOutput('');
      setValidationResult(null);
    }
  };

  if (loading) {
    return (
      <div className="lab-environment loading">
        <div className="loading-spinner">Cargando laboratorio...</div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="lab-environment error">
        <h2>Laboratorio no encontrado</h2>
        <button onClick={() => navigate('/virtual-labs')}>Volver a Laboratorios</button>
      </div>
    );
  }

  const currentStepData = lab.steps[currentStep];

  return (
    <div className="lab-environment">
      <header className="lab-header">
        <button 
          className="back-button"
          onClick={() => navigate('/virtual-labs')}
        >
          ← Volver
        </button>
        <div className="lab-info">
          <h1>{lab.title}</h1>
          <p>{lab.description}</p>
        </div>
        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{progress}% completado</span>
        </div>
      </header>

      <div className="lab-content">
        <div className="step-info">
          <h2>Paso {currentStep + 1}: {currentStepData.title}</h2>
          <p>{currentStepData.description}</p>
          
          <div className="instructions">
            <h3>Instrucciones:</h3>
            <ul>
              {currentStepData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          {hints.length > 0 && (
            <div className="hints-section">
              <button 
                className="hints-toggle"
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Ocultar' : 'Mostrar'} Pistas ({hints.length})
              </button>
              {showHints && (
                <div className="hints">
                  {hints.map((hint, index) => (
                    <div key={index} className="hint">
                      💡 {hint}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="code-section">
          <div className="code-editor">
            <div className="editor-header">
              <span>Editor de Código</span>
              <button onClick={resetCode} className="reset-button">
                Reiniciar
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Escribe tu código aquí..."
              className="code-textarea"
            />
          </div>

          <div className="terminal">
            <div className="terminal-header">
              <span>Terminal</span>
              <button 
                onClick={runCode} 
                disabled={isRunning}
                className="run-button"
              >
                {isRunning ? 'Ejecutando...' : '▶ Ejecutar'}
              </button>
            </div>
            <div 
              ref={terminalRef}
              className="terminal-output"
            >
              {terminalOutput || 'Presiona "Ejecutar" para ver el resultado...'}
            </div>
          </div>
        </div>
      </div>

      <div className="step-navigation">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="nav-button prev"
        >
          ← Anterior
        </button>
        
        <span className="step-counter">
          {currentStep + 1} de {lab.steps.length}
        </span>
        
        <button 
          onClick={nextStep} 
          disabled={currentStep === lab.steps.length - 1 || !validationResult?.success}
          className="nav-button next"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default LabEnvironment;