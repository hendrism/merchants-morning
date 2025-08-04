import React from 'react';

const TabButton = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-sm font-bold ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
  >
    {children}
    {count !== undefined && count !== null && ` (${count})`}
  </button>
);

export default TabButton;
