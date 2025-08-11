import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'market', label: 'Market', icon: '📰' },
    { id: 'materials', label: 'Materials', icon: '📦' },
    { id: 'workshop', label: 'Workshop', icon: '⚒️' },
    { id: 'items', label: 'Items', icon: '🎒' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-4 shadow-lg z-30 safe-area-bottom">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`flex flex-col items-center justify-center gap-1 py-3 px-1 transition-all ${
            currentTab === tab.id 
              ? 'bg-gradient-to-tr from-blue-500 to-blue-700 text-white' 
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="text-xl">{tab.icon}</div>
          <div className="text-xs font-medium text-center leading-tight">{tab.label}</div>
        </button>
      ))}
    </nav>
  );
};

BottomNavigation.propTypes = {
  currentTab: PropTypes.oneOf(['market', 'materials', 'workshop', 'items']).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default BottomNavigation;
