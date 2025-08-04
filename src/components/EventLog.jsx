import React from 'react';

const EventLog = ({ events }) => (
  <div className="bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto">
    {events.length === 0 ? (
      <p className="text-xs text-gray-500">No events yet...</p>
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

export default EventLog;
