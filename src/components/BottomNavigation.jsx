import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around py-2 dark:bg-gray-800 dark:border-gray-700">
      <button
        className={`flex-1 text-center p-2 ${currentPhase === 'prep' ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('prep')}
      >
        <div className="text-xl">🛠️</div>
        <div className="text-xs">Prep Work</div>
      </button>
      <button
        className={`flex-1 text-center p-2 ${currentPhase === 'shop' ? 'font-bold text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        onClick={() => onPhaseChange('shop')}
      >
        <div className="text-xl">🛒</div>
        <div className="text-xs">Shop Phase{customerCount > 0 ? ` (${customerCount})` : ''}</div>
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
