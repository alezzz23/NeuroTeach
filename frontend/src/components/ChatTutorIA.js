import React, { useState } from 'react';

function ChatTutorIA() {
  const [question, setQuestion] = useState('');
  const [emotion, setEmotion] = useState('feliz');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch('http://localhost:3000/tutor/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div>
      <h2>Chat con Tutor IA</h2>
      <form onSubmit={handleSend} style={{ marginBottom: '1rem' }}>
        <div>
          <label>Pregunta: </label>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
            style={{ width: '300px' }}
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Emoción: </label>
          <select value={emotion} onChange={e => setEmotion(e.target.value)}>
            <option value="feliz">Feliz</option>
            <option value="frustrado">Frustrado</option>
            <option value="aburrido">Aburrido</option>
            <option value="confundido">Confundido</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {response && <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '5px' }}><b>Respuesta del tutor:</b><br />{response}</div>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default ChatTutorIA; 