import React from 'react';
import PropTypes from 'prop-types';

// Simple radial/linear menu for contextual quick actions
const QuickActionMenu = ({
  actions = [],
  position = { x: 0, y: 0 },
  onAction,
  onDismiss,
  animateFrom = 'tap-point',
  className = '',
}) => {
  const handleAction = (action) => {
    if (onAction) onAction(action);
    if (action && typeof action.action === 'function') {
      action.action();
    }
    if (onDismiss) onDismiss();
  };

  return (
    <div
      className={`absolute z-50 p-2 bg-white rounded shadow-md ${className}`}
      style={{ left: position.x, top: position.y, transformOrigin: animateFrom }}
      role="menu"
    >
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          className="block w-full text-left px-3 py-1 hover:bg-gray-100"
          onClick={() => handleAction(a)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
};

QuickActionMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func,
    })
  ),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onAction: PropTypes.func,
  onDismiss: PropTypes.func,
  animateFrom: PropTypes.string,
  className: PropTypes.string,
};

export default QuickActionMenu;
