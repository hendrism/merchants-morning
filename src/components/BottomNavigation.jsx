import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-2 shadow z-10 dark:bg-gray-800 dark:border-gray-700">
      <button
        className={`flex flex-col items-center justify-center py-2 ${currentPhase === 'prep' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('prep')}
      >
        <div className="text-xl">🛠️</div>
        <div className="text-sm font-semibold">Prep Work</div>
        <div className="text-xs opacity-80">Buy • Craft • Organize</div>
      </button>
      <button
        className={`flex flex-col items-center justify-center py-2 ${currentPhase === 'shop' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('shop')}
      >
        <div className="text-xl">🛒</div>
        <div className="text-sm font-semibold">Shop</div>
        <div className="text-xs opacity-80">{customerCount} customers waiting</div>
      </button>
    </nav>
  );
};

BottomNavigation.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop']).isRequired,
  onPhaseChange: PropTypes.func.isRequired,
  customerCount: PropTypes.number,
};

export default BottomNavigation;
