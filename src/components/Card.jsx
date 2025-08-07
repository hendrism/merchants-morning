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
  animating = false
}) => {
  const getStatusClass = () => {
    switch (status) {
      case 'available': return 'card-header status-available';
      case 'locked': return 'card-header status-locked';
      case 'updated': return 'card-header status-updated';
      case 'vip': return 'card-header status-vip';
      default: return 'card-header';
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
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="font-bold">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {subtitle && (
          <span className={`text-sm ${subtitleClassName}`}>{subtitle}</span>
        )}
        <span className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
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
  status: PropTypes.oneOf(['normal', 'available', 'locked', 'updated', 'vip']),
  badge: PropTypes.number,
  animating: PropTypes.bool,
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
