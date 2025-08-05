import React from 'react';
import PropTypes from 'prop-types';

const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 flex items-center justify-center px-4 py-3 rounded-lg min-h-[48px] text-sm font-medium text-center whitespace-nowrap ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {children}
    {count !== undefined && count !== null && (
      <span className="absolute top-1 right-1 text-[10px] px-1 rounded bg-blue-600 text-white">
        {count}
      </span>
    )}
  </button>
);

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TabButton;
