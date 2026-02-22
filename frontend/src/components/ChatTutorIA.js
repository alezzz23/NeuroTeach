import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import { tutorService } from '../services/api';
import { io } from 'socket.io-client';
import './ChatTutorIA.css';

const EMOTION_ICONS = {
  feliz: '😊', happy: '😊',
  enojado: '😠', angry: '😠',
  triste: '😢', sad: '😢',
  asustado: '😨', fear: '😨',
  surprise: '😲',
  neutral: '😐',
  disgustado: '🤢', disgust: '🤢',
  confundido: '🤔',
  frustrado: '😤',
  aburrido: '😑',
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function renderMarkdown(text) {
  if (!text) return '';
  // Simple markdown: code blocks, bold, inline code, lists
  let html = text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\n/g, '<br/>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*?<\/li>(?:<br\/>)?)+)/g, '<ul>$1</ul>');
  return html;
}

function ChatTutorIA() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Webcam integration
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState(null);
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const emotionIntervalRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { getToken } = useAuth();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingConvs(true);
      const data = await tutorService.getConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConvs(false);
    }
  };

  const selectConversation = async (convId) => {
    setActiveConvId(convId);
    setSidebarOpen(false);
    try {
      const msgs = await tutorService.getConversationMessages(convId);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch {
      setMessages([]);
    }
  };

  const createNewConversation = async () => {
    try {
      const conv = await tutorService.createConversation('Nueva conversación');
      setConversations(prev => [conv, ...prev]);
      setActiveConvId(conv.id);
      setMessages([]);
      setSidebarOpen(false);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error creating conversation', err);
    }
  };

  // ==================== WEBCAM EMOTION ====================
  const connectEmotionSocket = useCallback(() => {
    if (socketRef.current?.connected) return;
    const token = getToken();
    socketRef.current = io(`${API_BASE_URL}/emotion`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 3,
      timeout: 10000,
    });

    socketRef.current.on('emotion', (data) => {
      if (data.emotion) {
        setDetectedEmotion(data.emotion);
      }
    });
  }, [getToken]);

  const sendEmotionFrame = useCallback(() => {
    if (webcamRef.current?.getScreenshot && socketRef.current?.connected) {
      const img = webcamRef.current.getScreenshot();
      if (img) socketRef.current.emit('frame', { image: img });
    }
  }, []);

  useEffect(() => {
    if (webcamEnabled) {
      connectEmotionSocket();
      emotionIntervalRef.current = setInterval(sendEmotionFrame, 2000);
    } else {
      if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      setDetectedEmotion(null);
    }
    return () => {
      if (emotionIntervalRef.current) clearInterval(emotionIntervalRef.current);
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
    };
  }, [webcamEnabled, connectEmotionSocket, sendEmotionFrame]);

  // ==================== SEND MESSAGE ====================
  const handleSend = async (text) => {
    const prompt = text || input.trim();
    if (!prompt || loading) return;
    setInput('');

    // If no conversation, create one
    let convId = activeConvId;
    if (!convId) {
      try {
        const conv = await tutorService.createConversation(prompt.slice(0, 50));
        convId = conv.id;
        setActiveConvId(conv.id);
        setConversations(prev => [conv, ...prev]);
      } catch {
        return;
      }
    }

    // Add user message optimistically
    const userMsg = { id: Date.now(), role: 'user', content: prompt, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history for API
      const historyForAPI = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const result = await tutorService.ask(prompt, {
        emotion: detectedEmotion || 'neutral',
        messageHistory: historyForAPI,
        conversationId: convId,
      });

      const assistantContent = result?.choices?.[0]?.message?.content || 'Sin respuesta del tutor.';
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: assistantContent, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);

      // Update conversation title if first message
      if (messages.length === 0) {
        setConversations(prev => prev.map(c =>
          c.id === convId ? { ...c, title: prompt.slice(0, 50) } : c
        ));
      }
    } catch (err) {
      const errorMsg = { id: Date.now() + 1, role: 'assistant', content: '❌ Error al conectar con el tutor. Intenta de nuevo.', createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    '¿Cómo funciona la recursión?',
    'Explícame los arrays en JavaScript',
    '¿Qué es una API REST?',
    'Ayúdame con Python básico',
  ];

  return (
    <div className="chat-container">
      {/* ====== SIDEBAR ====== */}
      <aside className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="chat-sidebar-header">
          <button className="chat-new-btn" onClick={createNewConversation}>
            <i className="fas fa-plus"></i>
            Nueva conversación
          </button>
        </div>
        <div className="chat-list">
          {loadingConvs ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)' }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              Sin conversaciones aún
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`chat-list-item ${conv.id === activeConvId ? 'active' : ''}`}
                onClick={() => selectConversation(conv.id)}
              >
                <i className="fas fa-comment-dots"></i>
                <span className="chat-list-title">{conv.title || 'Sin título'}</span>
                <span className="chat-list-time">{formatTime(conv.updatedAt)}</span>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ====== MAIN CHAT ====== */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-title">
            <button
              className="chat-webcam-toggle d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ border: 'none', background: 'transparent', color: 'inherit', fontSize: 16, padding: 4 }}
            >
              <i className="fas fa-bars"></i>
            </button>
            <i className="fas fa-robot" style={{ color: '#8b5cf6' }}></i>
            Tutor IA NeuroTeach
          </div>
          <div className="chat-header-actions">
            {detectedEmotion && (
              <span className="chat-emotion-badge active">
                {EMOTION_ICONS[detectedEmotion.toLowerCase()] || '😐'} {detectedEmotion}
              </span>
            )}
            <button
              className={`chat-webcam-toggle ${webcamEnabled ? 'active' : ''}`}
              onClick={() => setWebcamEnabled(!webcamEnabled)}
            >
              <i className={`fas ${webcamEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
              {webcamEnabled ? 'Cámara activa' : 'Activar cámara'}
            </button>
          </div>
        </div>

        {/* Webcam mini */}
        {webcamEnabled && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 20px 0' }}>
            <div className="chat-webcam-mini">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={160}
                height={120}
                videoConstraints={{ facingMode: 'user', width: 160, height: 120 }}
              />
              <div className="chat-webcam-live">
                <span className="chat-webcam-live-dot"></span>
                LIVE
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 && !loading ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <i className="fas fa-brain"></i>
            </div>
            <h3>¡Hola! Soy tu tutor de IA</h3>
            <p>Pregúntame lo que quieras sobre cualquier tema. Si activas la cámara, adaptaré mis respuestas a tu estado emocional.</p>
            <div className="chat-suggestions">
              {suggestions.map((s, i) => (
                <button key={i} className="chat-suggestion" onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.role}`}>
                <div className="chat-avatar">
                  <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                </div>
                <div>
                  <div
                    className="chat-bubble"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                  <div className="chat-msg-time">{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                <div className="chat-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
                  <i className="fas fa-robot"></i>
                </div>
                <div className="chat-typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatTutorIA;