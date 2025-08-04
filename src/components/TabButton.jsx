import React from 'react';
import PropTypes from 'prop-types';

const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
    {count !== undefined && count !== null && ` (${count})`}
  </button>
);

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  count: PropTypes.number,
};

export default TabButton;
