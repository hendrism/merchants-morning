import React from 'react';
import PropTypes from 'prop-types';

const EventLog = ({ events }) => (
  <div className="bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto">
    {events.length === 0 ? (
      <p className="text-gray-500 italic text-center py-8 text-xs">No events yet...</p>
    ) : (
      events.map(event => (
        <div key={event.id} className="text-xs mb-1">
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
          <div className="text-gray-400">{event.timestamp}</div>
        </div>
      ))
    )}
  </div>
);

EventLog.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EventLog;
