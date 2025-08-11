import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ 
  currentPhase, 
  day, 
  gold, 
  onOpenShop, 
  onCloseShop, 
  onStartNewDay, 
  gameState 
}) => {
  const phaseLabel = currentPhase === 'prep' ? 'Prep' : currentPhase === 'shop' ? 'Shop' : 'End of Day';
  const phaseIcon = currentPhase === 'prep' ? '🛠️' : currentPhase === 'shop' ? '🛒' : '🌙';

  const renderActionButton = () => {
    switch (currentPhase) {
      case 'prep':
        const hasInventory = Object.values(gameState.inventory || {}).some(count => count > 0);
        return (
          <button
            onClick={onOpenShop}
            disabled={!hasInventory}
            className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-1 ${
              hasInventory
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={!hasInventory ? 'Craft some items first!' : 'Open your shop'}
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Open Shop</span>
          </button>
        );
      
      case 'shop':
        return (
          <button
            onClick={onCloseShop}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-1 shadow-md hover:shadow-lg"
          >
            <span>🏁</span>
            <span className="hidden sm:inline">Close Shop</span>
          </button>
        );
      
      case 'end_day':
        return (
          <button
            onClick={onStartNewDay}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-1 shadow-md hover:shadow-lg"
          >
            <span>🌅</span>
            <span className="hidden sm:inline">New Day</span>
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <header className="bg-white p-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold text-amber-700">
          🏰 Merchant's Morning
        </h1>
        
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-tr from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium">
            {phaseIcon} {phaseLabel} - Day {day}
          </span>
          
          <div className="bg-gradient-to-tr from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1 text-sm">
            <span>💰</span>
            <span>{gold}</span>
          </div>
          
          {renderActionButton()}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop', 'end_day']).isRequired,
  day: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
  onOpenShop: PropTypes.func,
  onCloseShop: PropTypes.func,
  onStartNewDay: PropTypes.func,
  gameState: PropTypes.object,
};

export default Header;
