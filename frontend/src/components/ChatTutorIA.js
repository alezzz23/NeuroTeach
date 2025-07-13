import React, { useState } from 'react';

import { useAuth } from '../AuthContext';

function ChatTutorIA() {
  const [question, setQuestion] = useState('');
  const [emotion, setEmotion] = useState('feliz');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const token = getToken();
      const res = await fetch('http://localhost:3000/tutor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ prompt: question, emotion })
      });
      const data = await res.json();
      // Mostrar solo el contenido relevante de la respuesta
      setResponse(data.choices?.[0]?.message?.content || JSON.stringify(data));
    } catch (err) {
      setError('Error al conectar con el backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                <i className="fas fa-robot me-2 text-primary"></i>Chat con Tutor IA
              </h2>
              <form className="row g-3 align-items-center mb-3" onSubmit={handleSend}>
                <div className="col-12 col-md-8 mb-2 mb-md-0">
                  <label htmlFor="questionInput" className="form-label">Pregunta:</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="fas fa-question"></i></span>
                    <input
                      id="questionInput"
                      type="text"
                      className="form-control"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="emotionSelect" className="form-label">Emoción:</label>
                  <select
                    id="emotionSelect"
                    className="form-select"
                    value={emotion}
                    onChange={e => setEmotion(e.target.value)}
                  >
                    <option value="feliz">Feliz</option>
                    <option value="frustrado">Frustrado</option>
                    <option value="aburrido">Aburrido</option>
                    <option value="confundido">Confundido</option>
                  </select>
                </div>
                <div className="col-12 d-grid mt-2">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    <i className="fas fa-paper-plane me-2"></i>{loading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
              {response && (
                <div className="alert alert-success mt-3">
                  <b>Respuesta del tutor:</b><br />{response}
                </div>
              )}
              {error && <div className="alert alert-danger text-center mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatTutorIA; 