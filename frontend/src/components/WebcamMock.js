import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '../AuthContext';
import { io } from 'socket.io-client';

function WebcamMock() {
  const [emotion, setEmotion] = useState(null);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const { getToken } = useAuth();
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (!streaming) return;
    const token = getToken();
    // Conexión WebSocket
    socketRef.current = io('http://localhost:3000/emotion', {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current.on('emotion', (data) => {
      setEmotion(data.emotion);
    });
    socketRef.current.on('error', (msg) => {
      setError(msg);
      setStreaming(false);
    });
    return () => {
      socketRef.current && socketRef.current.disconnect();
    };
    // eslint-disable-next-line
  }, [streaming]);

  useEffect(() => {
    if (!streaming) return;
    let interval;
    function sendFrame() {
      if (
        webcamRef.current &&
        webcamRef.current.getScreenshot &&
        socketRef.current &&
        socketRef.current.connected
      ) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          socketRef.current.emit('frame', { image: imageSrc });
        }
      }
    }
    interval = setInterval(sendFrame, 1000); // 1 frame por segundo
    return () => clearInterval(interval);
  }, [streaming]);

  const handleStart = () => {
    setEmotion(null);
    setError(null);
    setStreaming(true);
  };

  const handleStop = () => {
    setStreaming(false);
    setEmotion(null);
    setError(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">
                <i className="fas fa-video me-2 text-primary"></i>Webcam Tiempo Real
              </h2>
              <p>Activa la webcam para analizar emociones en tiempo real.</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={320}
                  height={240}
                  videoConstraints={{ facingMode: 'user' }}
                />
              </div>
              {!streaming ? (
                <button className="btn btn-success mb-3" onClick={handleStart}>
                  <i className="fas fa-play me-2"></i>Iniciar análisis en tiempo real
                </button>
              ) : (
                <button className="btn btn-danger mb-3" onClick={handleStop}>
                  <i className="fas fa-stop me-2"></i>Detener análisis
                </button>
              )}
              {emotion && <div className="alert alert-info"><b>Emoción detectada:</b> <span className="text-capitalize">{emotion}</span></div>}
              {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebcamMock; 