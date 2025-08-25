import React, { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'expired' ? '⏰' : type === 'success' ? '✅' : 'ℹ️'}
        </span>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close" 
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
