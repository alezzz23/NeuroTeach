import React, { useEffect, useState } from 'react';

/**
 * Toast notification component for user feedback
 */
function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-visible' : 'toast-hiding'}`}>
      <i className={`fas ${icons[type] || icons.info}`} />
      <span>{message}</span>
      <button className="toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>
        <i className="fas fa-times" />
      </button>
    </div>
  );
}

/**
 * Toast container - manages multiple toasts
 */
export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * Hook to manage toasts
 */
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast, success: (m) => addToast(m, 'success'), error: (m) => addToast(m, 'error'), warning: (m) => addToast(m, 'warning'), info: (m) => addToast(m, 'info') };
}

export default Toast;
