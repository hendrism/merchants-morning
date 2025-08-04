import React from 'react';

const Notifications = ({ notifications }) => (
  <div className="fixed top-4 right-4 space-y-2 z-50">
    {notifications.map(notification => (
      <div
        key={notification.id}
        className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-pulse ${
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

export default Notifications;
