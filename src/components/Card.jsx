import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-lg mb-3 dark:bg-gray-800">
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export const CardHeader = ({ icon, title, subtitle, expanded, onToggle, isEmpty, subtitleClassName = '' }) => (
  <button
    onClick={onToggle}
    className={`w-full flex items-center justify-between p-4 text-left ${isEmpty ? 'opacity-60' : ''}`}
    aria-expanded={expanded}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <span className="font-bold">{title}</span>
    </div>
    {subtitle && (
      <span className={`text-sm ${subtitleClassName}`}>{subtitle}</span>
    )}
  </button>
);

CardHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  isEmpty: PropTypes.bool,
  subtitleClassName: PropTypes.string,
};

export const CardContent = ({ children }) => (
  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Card;
