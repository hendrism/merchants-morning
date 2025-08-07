import React from 'react';
import PropTypes from 'prop-types';

// Overlay that lists AI powered suggestions for the user
const SmartSuggestions = ({
  suggestions = [],
  userSkillLevel,
  onAccept,
  onDismiss,
  learningEnabled = true,
  className = '',
}) => {
  const handleAccept = (s) => {
    if (onAccept) onAccept(s);
    if (s && typeof s.action === 'function') s.action();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${className}`}>
      <div className="bg-white rounded shadow-lg max-w-md w-full p-4" role="dialog">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Suggestions</h2>
          {onDismiss && (
            <button type="button" onClick={onDismiss} aria-label="Close">
              ×
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li key={s.title} className="p-2 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.icon} {s.title}</div>
                  {s.description && (
                    <p className="text-sm text-gray-600">{s.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
                  onClick={() => handleAccept(s)}
                >
                  Do it
                </button>
              </div>
            </li>
          ))}
        </ul>
        {learningEnabled && (
          <p className="mt-4 text-xs text-gray-500">
            Suggestions adapt based on your play style (skill: {userSkillLevel || 'unknown'})
          </p>
        )}
      </div>
    </div>
  );
};

SmartSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      action: PropTypes.func,
      icon: PropTypes.node,
    })
  ),
  userSkillLevel: PropTypes.string,
  onAccept: PropTypes.func,
  onDismiss: PropTypes.func,
  learningEnabled: PropTypes.bool,
  className: PropTypes.string,
};

export default SmartSuggestions;
