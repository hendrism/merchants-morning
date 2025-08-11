import React from 'react';
import PropTypes from 'prop-types';

const phaseGradient = phase => (
  phase === 'shop' ? 'from-green-500 to-green-700' : 'from-blue-500 to-blue-700'
);

const GameHeader = ({ currentPhase, day, gold }) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-bold text-amber-800">🏰 Merchant's Morning</h1>
        <div className={`text-white text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-br ${phaseGradient(currentPhase)}`}>
          {currentPhase === 'shop' ? `🛒 Shop - Day ${day}` : `🛠️ Prep - Day ${day}`}
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full text-white font-semibold bg-gradient-to-br from-yellow-500 to-yellow-600">
          <span>💰</span>
          <span>{gold}</span>
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
