import { useState, useEffect } from "react";

/**
 * Toast Notification Component
 * Shows temporary success/error/info messages to the user
 */
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }[type] || '📢';

  return (
    <div className={`fixed bottom-4 right-4 rounded border px-4 py-3 flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-4 ${bgColor} z-50`}>
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-lg opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 * Manages multiple toast notifications
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Global function to show toasts (can be used with a custom hook/context)
  window.showToast = ({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
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
};

export default Toast;
