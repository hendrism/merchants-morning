import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around z-10 dark:bg-gray-800 dark:border-gray-700">
      <button
        className={`flex-1 text-center py-2 ${currentPhase === 'prep' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('prep')}
      >
        <div className="text-lg">🛠️</div>
        <div className="text-xs">Prep Work</div>
      </button>
      <button
        className={`flex-1 text-center py-2 ${currentPhase === 'shop' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('shop')}
      >
        <div className="text-lg">🛒</div>
        <div className="text-xs">{customerCount} customers</div>
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
