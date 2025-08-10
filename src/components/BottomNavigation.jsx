import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-white dark:bg-gray-800">
      <button
        className={`flex-1 p-4 text-sm font-medium flex flex-col items-center justify-center ${currentPhase === 'prep' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
        onClick={() => onPhaseChange('prep')}
      >
        <span className="text-lg">🛠️</span>
        <span>Prep Work</span>
      </button>
      <button
        className={`flex-1 p-4 text-sm font-medium flex flex-col items-center justify-center ${currentPhase === 'shop' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
        onClick={() => onPhaseChange('shop')}
      >
        <span className="text-lg">🛒</span>
        <span>{customerCount} customers</span>
      </button>
    </nav>
  );
};

BottomNavigation.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop']).isRequired,
  onPhaseChange: PropTypes.func.isRequired,
  customerCount: PropTypes.number.isRequired,
};

export default BottomNavigation;
