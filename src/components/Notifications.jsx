import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { playNotificationSound, closeAudioContext } from '../utils/audio';

const Notifications = ({ notifications, soundEnabled }) => {
  useEffect(() => {
    if (!soundEnabled) return;
    if (notifications.length === 0) return;
    playNotificationSound();
  }, [notifications, soundEnabled]);

  useEffect(() => {
    if (!soundEnabled) {
      closeAudioContext();
    }
    return () => {
      closeAudioContext();
    };
  }, [soundEnabled]);

  return (
    <div role="status" aria-live="polite" className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-slide-in animate-pulse ${
            notification.type === 'success'
              ? 'bg-green-500'
              : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  soundEnabled: PropTypes.bool,
};

Notifications.defaultProps = {
  soundEnabled: true,
};

export default Notifications;
