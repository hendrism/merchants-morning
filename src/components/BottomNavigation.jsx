import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-2 shadow-lg z-10">
      <button
        className={`flex flex-col items-center gap-0.5 p-3 transition-colors ${currentPhase === 'prep' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
        onClick={() => onPhaseChange('prep')}
      >
        <div className="text-xl">🛠️</div>
        <div className="text-sm font-medium">Prep Work</div>
        <div className="text-xs opacity-80">Buy • Craft • Organize</div>
      </button>
      <button
        className={`flex flex-col items-center gap-0.5 p-3 transition-colors ${currentPhase === 'shop' ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
        onClick={() => onPhaseChange('shop')}
      >
        <div className="text-xl">🛒</div>
        <div className="text-sm font-medium">Shop</div>
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
