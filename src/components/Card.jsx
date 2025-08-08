import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg mb-3 dark:bg-gray-800 ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardHeader = ({ 
  icon, 
  title, 
  subtitle,
  expanded,
  onToggle,
  isEmpty,
  subtitleClassName = '',
  status = 'normal',
  badge,
  animating = false,
  progress
}) => {
  const getStatusClass = () => {
    switch (status) {
      case 'available':
      case 'ready':
        return 'card-header status-available';
      case 'locked':
        return 'card-header status-locked';
      case 'updated':
        return 'card-header status-updated';
      case 'vip':
        return 'card-header status-vip';
      default:
        return 'card-header';
    }
  };

  const statusDotColor = () => {
    switch (status) {
      case 'available':
      case 'ready':
        return 'bg-green-500';
      case 'locked':
        return 'bg-red-500';
      case 'updated':
        return 'bg-blue-500';
      case 'vip':
        return 'bg-purple-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 text-left transition-all duration-200 ${getStatusClass()} ${
        isEmpty ? 'opacity-60' : ''
      } ${animating ? 'animate-pulse' : ''}`}
      aria-expanded={expanded}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <span className="sr-only">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full"
            aria-label={`${badge} items`}
          >
            {badge}
          </span>
        )}
        {progress && (
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {subtitle && <span className="sr-only">{subtitle}</span>}
        <span className={`w-3 h-3 rounded-full ${statusDotColor()}`}></span>
        <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </div>
    </button>
  );
};

CardHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool,
  subtitleClassName: PropTypes.string,
  status: PropTypes.oneOf(['normal', 'available', 'locked', 'updated', 'vip', 'ready', 'waiting']),
  badge: PropTypes.number,
  animating: PropTypes.bool,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }),
};

export const CardContent = ({ children, expanded = true }) => (
  <div className={`card-content border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
    expanded ? 'visible' : ''
  }`}>
    <div className="p-4">
      {children}
    </div>
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
};

export default Card;
