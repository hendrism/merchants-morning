import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Notifications = ({ notifications, soundEnabled: defaultSoundEnabled = true }) => {
  const audioCtxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('notificationSoundEnabled');
      if (stored !== null) return stored === 'true';
    }
    return defaultSoundEnabled;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('notificationSoundEnabled', soundEnabled);
    }
  }, [soundEnabled]);

  useEffect(() => {
    const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!soundEnabled || !AudioCtx) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (!soundEnabled || notifications.length === 0) return;
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, [notifications, soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      <button
        type="button"
        onClick={toggleSound}
        className="px-2 py-1 rounded bg-gray-700 text-white"
        aria-pressed={soundEnabled}
      >
        {soundEnabled ? 'Mute sound' : 'Enable sound'}
      </button>
      <div role="status" aria-live="polite" aria-atomic="true">
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

export default Notifications;
