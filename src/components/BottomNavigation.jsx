import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ active, onClick, icon, label, sublabel }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
      active
        ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <div className="text-xl">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
    <div className="text-xs opacity-80">{sublabel}</div>
  </button>
);

Button.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sublabel: PropTypes.string.isRequired,
};

const BottomNavigation = ({ currentPhase, onPhaseChange, customerCount = 0 }) => {
  const customersLabel = `${customerCount} customer${customerCount === 1 ? '' : 's'} waiting`;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-2 shadow-md z-10">
      <Button
        active={currentPhase === 'prep'}
        onClick={() => onPhaseChange('prep')}
        icon="🛠️"
        label="Prep Work"
        sublabel="Buy • Craft • Organize"
      />
      <Button
        active={currentPhase === 'shop'}
        onClick={() => onPhaseChange('shop')}
        icon="🛒"
        label="Shop"
        sublabel={customersLabel}
      />
    </nav>
  );
};

BottomNavigation.propTypes = {
  currentPhase: PropTypes.oneOf(['prep', 'shop']).isRequired,
  onPhaseChange: PropTypes.func.isRequired,
  customerCount: PropTypes.number,
};

export default BottomNavigation;
