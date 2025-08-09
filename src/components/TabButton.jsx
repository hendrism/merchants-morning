import React from 'react';
import PropTypes from 'prop-types';

const THEME_STYLES = {
  blacksmith: 'from-gray-700 to-gray-900 border-gray-400',
  woodsman: 'from-green-600 to-green-800 border-green-500',
  trader: 'from-purple-600 to-purple-800 border-purple-500',
  tailor: 'from-orange-600 to-orange-800 border-orange-500',
  default: 'from-blue-600 to-blue-800 border-blue-500',
};

const TabButton = ({ active, onClick, children, count, theme = 'default', ...props }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-colors min-w-[80px] flex-shrink-0 ${
      active
        ? `bg-gradient-to-br ${THEME_STYLES[theme] || THEME_STYLES.default} text-white`
        : 'bg-white/10 text-gray-600 hover:bg-white/20 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`}
    {...props}
  >
    {children}
    {count !== undefined && count !== null && (
      <div className="tab-count mt-1">{count}</div>
    )}
  </button>
);

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  theme: PropTypes.string,
};

export default TabButton;
