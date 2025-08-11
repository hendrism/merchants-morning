import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ currentPhase, day, gold }) => {
  const phaseLabel = currentPhase === 'prep' ? 'Prep' : 'Shop';
  const phaseIcon = currentPhase === 'prep' ? '🛠️' : '🛒';

  return (
    <header className="bg-white p-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold text-amber-700">
          🏰 Merchant's Morning
        </h1>
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-tr from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium">
            {phaseIcon} {phaseLabel} - Day {day}
          </span>
          <div className="bg-gradient-to-tr from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1 text-sm">
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
  day: PropTypes.number.isRequired,
  gold: PropTypes.number.isRequired,
};

export default Header;
