import React from 'react';
import PropTypes from 'prop-types';

const EventLog = ({ events }) => (
  <div className="fixed bottom-16 left-12 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 max-h-32 overflow-y-auto shadow-lg z-40 safe-area-bottom">
    {events.length === 0 ? (
      <p className="text-gray-500 italic text-center py-2 text-xs">No events yet...</p>
    ) : (
      <div className="space-y-1">
        {events.slice(0, 5).map(event => (
          <div key={event.id} className="text-xs">
            <span
              className={
                event.type === 'success'
                  ? 'text-green-600'
                  : event.type === 'error'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }
            >
              {event.message}
            </span>
            <span className="text-gray-400 ml-2 text-xs">{event.timestamp}</span>
          </div>
        ))}
        {events.length > 5 && (
          <div className="text-xs text-gray-400 text-center pt-1 border-t">
            +{events.length - 5} more events
          </div>
        )}
      </div>
    )}
  </div>
);

EventLog.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EventLog;
