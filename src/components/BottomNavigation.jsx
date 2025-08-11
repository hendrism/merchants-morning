import React from 'react';
import PropTypes from 'prop-types';

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-2 shadow-lg z-50 safe-area-bottom">
      {/* Prep Work Button */}
      <button
        className={`flex flex-col items-center justify-center gap-2 py-4 px-2 transition-all ${
          currentPhase === 'prep' 
            ? 'bg-gradient-to-tr from-blue-500 to-blue-700 text-white' 
            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
        onClick={() => onPhaseChange('prep')}
      >
        <div className="text-2xl">🛠️</div>
        <div className="text-sm font-semibold">Prep Work</div>
        <div className="text-xs opacity-80 text-center leading-tight">
          Buy • Craft • Organize
        </div>
      </button>

      {/* Shop Phase Button */}
      <button
        className={`flex flex-col items-center justify-center gap-2 py-4 px-2 transition-all relative ${
          currentPhase === 'shop' 
            ? 'bg-gradient-to-tr from-blue-500 to-blue-700 text-white' 
            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
        }`}
        onClick={() => onPhaseChange('shop')}
      >
        <div className="text-2xl">🛒</div>
        <div className="text-sm font-semibold">Shop Phase</div>
        <div className="text-xs opacity-80 text-center leading-tight">
          {customerCount > 0 ? (
            <>
              <span className="font-medium">{customerCount}</span> {customerCount === 1 ? 'customer' : 'customers'} waiting
            </>
          ) : (
            'Serve customers'
          )}
        </div>
        
        {/* Customer count badge */}
        {customerCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[24px]">
            {customerCount > 9 ? '9+' : customerCount}
          </div>
        )}
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
