import React from 'react';
import PropTypes from 'prop-types';

const Notifications = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container fixed bottom-28 left-4 right-4 z-40 pointer-events-none">
      <div className="flex flex-col gap-2 items-center">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-toast px-4 py-2 rounded-lg shadow-lg text-white font-medium text-sm max-w-sm animate-slide-up pointer-events-auto ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">
                {notification.type === 'success' && '✅'}
                {notification.type === 'error' && '❌'}
                {notification.type === 'info' && 'ℹ️'}
              </span>
              <span className="flex-1">{notification.message}</span>
            </div>
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
};

export default Notifications;
