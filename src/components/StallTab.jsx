import React from 'react';
import PropTypes from 'prop-types';

const StallTab = ({ stall, isActive, materialCount, onClick }) => (
  <button
    onClick={onClick}
    className={`stall-tab ${stall.theme} ${isActive ? 'active' : ''}`}
  >
    <div className="tab-icon">{stall.icon}</div>
    <div className="tab-info">
      <div className="tab-name">{stall.name}</div>
      <div className="tab-count">{materialCount}</div>
    </div>
  </button>
);

StallTab.propTypes = {
  stall: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  materialCount: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StallTab;
