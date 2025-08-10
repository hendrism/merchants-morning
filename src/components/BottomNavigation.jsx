import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-sm dark:bg-gray-800 dark:border-gray-700">
      <button
        className={`flex-1 flex flex-col items-center gap-1 min-h-[44px] ${currentPhase === 'prep' ? 'text-blue-600' : 'text-gray-600'}`}
        onClick={() => onPhaseChange('prep')}
      >
        <span className="text-xl">🛠️</span>
        <span className="font-semibold">Prep Work</span>
        <span className="text-xs">Buy • Craft • Organize</span>
      </button>
      <button
        className={`flex-1 flex flex-col items-center gap-1 min-h-[44px] ${currentPhase === 'shop' ? 'text-blue-600' : 'text-gray-600'}`}
        onClick={() => onPhaseChange('shop')}
      >
        <span className="text-xl">🛒</span>
        <span className="font-semibold">Shop Phase</span>
        <span className="text-xs">{customerCount} customers waiting</span>
      </button>
    </nav>
  );
};

BottomNavigation.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  onPhaseChange: PropTypes.func.isRequired,
  customerCount: PropTypes.number.isRequired,
};

export default BottomNavigation;
