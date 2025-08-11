import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ currentPhase, gold, day }) => {
  const phaseText = currentPhase === 'prep' ? '🛠️ Prep' : '🛒 Shop';
  return (
    <header className="bg-white p-4 shadow sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-sm font-bold text-amber-800">🏰 Merchant's Morning</h1>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full">
            {phaseText} - Day {day}
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <span>💰</span>
            <span>{gold}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop']).isRequired,
  gold: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
};

export default Header;
