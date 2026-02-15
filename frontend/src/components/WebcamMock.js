import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '../AuthContext';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config';

const EMOTION_ICONS = {
  feliz: '😊',
  enojado: '😠',
  triste: '😢',
  asusta: '😨',
  surprise: '😲',
  neutral: '😐',
  disgustado: '🤢',
  desconfiado: '😏',
  neutral: '😐',
};

function WebcamMock() {
  const [emotion, setEmotion] = useState(null);
  const [emotions, setEmotions] = useState({});
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const reconnectAttempts = useRef(0);
  
  const { getToken } = useAuth();

  const connectWebSocket = useCallback(() => {
    if (socketRef.current?.connected) return;
    
    setConnecting(true);
    const token = getToken();
    
    socketRef.current = io(`${API_BASE_URL}/emotion`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to emotion service');
      setConnecting(false);
      setError(null);
      reconnectAttempts.current = 0;
    });

    socketRef.current.on('emotion', (data) => {
      if (data.error) {
        console.error('Emotion error:', data.error);
        return;
      }
      if (data.emotion) {
        setEmotion(data.emotion);
        setEmotions(data.emotions || {});
        setConfidence(data.confidence || 0);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from emotion service');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      reconnectAttempts.current += 1;
      if (reconnectAttempts.current >= 5) {
        setError('No se pudo conectar al servicio de emociones. Asegúrate de que el servidor esté corriendo.');
        setStreaming(false);
      }
    });
  }, [getToken]);

  const disconnectWebSocket = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const sendFrame = useCallback(() => {
    if (
      webcamRef.current &&
      webcamRef.current.getScreenshot &&
      socketRef.current?.connected
    ) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socketRef.current.emit('frame', { image: imageSrc });
      }
    }
  }, []);

  useEffect(() => {
    if (streaming) {
      connectWebSocket();
      
      // Enviar frames cada segundo
      intervalRef.current = setInterval(sendFrame, 1000);
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [streaming, connectWebSocket, disconnectWebSocket, sendFrame]);

  const handleStart = () => {
    setEmotion(null);
    setEmotions({});
    setConfidence(0);
    setError(null);
    reconnectAttempts.current = 0;
    setStreaming(true);
  };

  const handleStop = () => {
    setStreaming(false);
    setEmotion(null);
    setEmotions({});
    setConfidence(0);
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      feliz: '#22c55e',
      happy: '#22c55e',
      enojado: '#ef4444',
      angry: '#ef4444',
      triste: '#3b82f6',
      sad: '#3b82f6',
      asustado: '#f59e0b',
      fear: '#f59e0b',
      neutral: '#6b7280',
      disgustado: '#8b5cf6',
      disgust: '#8b5cf6',
    };
    return colors[emotion?.toLowerCase()] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-surface-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-surface-900 mb-2">
              <i className="fas fa-video mr-2 text-brand-green"></i>
              Detección de Emociones
            </h2>
            <p className="text-surface-500">
              Activa la webcam para analizar tus emociones en tiempo real
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg mb-6">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={480}
                height={360}
                videoConstraints={{ facingMode: 'user', width: 480, height: 360 }}
                className="rounded-xl"
              />
              {streaming && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                    EN VIVO
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-6">
              {!streaming ? (
                <button
                  onClick={handleStart}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <i className="fas fa-play"></i>
                  Iniciar análisis
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="btn bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                >
                  <i className="fas fa-stop"></i>
                  Detener
                </button>
              )}
            </div>

            {error && (
              <div className="w-full p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {emotion && streaming && (
              <div className="w-full">
                <div className="flex items-center justify-center gap-4 p-4 bg-surface-50 rounded-xl mb-4">
                  <span className="text-5xl">{EMOTION_ICONS[emotion.toLowerCase()] || '😐'}</span>
                  <div>
                    <p className="text-2xl font-semibold" style={{ color: getEmotionColor(emotion) }}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </p>
                    <p className="text-sm text-surface-500">
                      Confianza: {confidence}%
                    </p>
                  </div>
                </div>

                {Object.keys(emotions).length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(emotions)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([emo, score]) => (
                        <div
                          key={emo}
                          className="p-3 bg-surface-50 rounded-lg text-center"
                        >
                          <p className="text-lg mb-1">{EMOTION_ICONS[emo] || '😐'}</p>
                          <p className="text-xs text-surface-500 capitalize">{emo}</p>
                          <p className="text-sm font-medium" style={{ color: getEmotionColor(emo) }}>
                            {score}%
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {streaming && !emotion && !error && (
              <div className="text-center text-surface-400">
                <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Analizando...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamMock;
