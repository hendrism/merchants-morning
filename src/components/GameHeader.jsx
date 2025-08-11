import React from 'react';
import PropTypes from 'prop-types';

const GameHeader = ({ currentPhase, day, gold }) => {
  const badgeText = currentPhase === 'shop' ? `🛒 Shop - Day ${day}` : `🛠️ Prep - Day ${day}`;
  return (
    <header className="bg-white p-4 shadow sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold text-amber-900">🏰 Merchant's Morning</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-blue-700">
            {badgeText}
          </span>
          <span className="px-3 py-1 rounded-full font-bold text-white bg-gradient-to-br from-amber-500 to-amber-600 flex items-center gap-1">
            <span>💰</span>
            <span>{gold}</span>
          </span>
        </div>
      </div>
    </header>
  );
};

GameHeader.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop']).isRequired,
  day: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
};

export default GameHeader;

