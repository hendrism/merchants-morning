import React from 'react';
import PropTypes from 'prop-types';

const MaterialStallCard = ({ material, getRarityColor }) => {
  const getStackElements = (count) => {
    const maxVisible = 3;
    const visibleCount = Math.min(count, maxVisible);
    
    return Array.from({ length: visibleCount }, (_, i) => (
      <div
        key={i}
        className="stack-item"
        style={{
          transform: `translateY(${i * -4}px) translateX(${i * 2}px)`,
          zIndex: maxVisible - i,
          opacity: 1 - (i * 0.1),
          filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
        }}
      >
        {material.icon}
      </div>
    ));
  };

  return (
    <div className={`material-stall-card ${getRarityColor(material.rarity)}`}>
      <div className="material-header">
        <div className="material-name">{material.name}</div>
        <div className={`rarity-badge rarity-${material.rarity}`}>
          {material.rarity}
        </div>
      </div>
      <div className="material-visual">
        <div className="stack-container">
          {getStackElements(material.count)}
          {material.count > 3 && (
            <div className="overflow-indicator">+{material.count - 3}</div>
          )}
        </div>
        <div className="count-display">×{material.count}</div>
      </div>
    </div>
  );
};

MaterialStallCard.propTypes = {
  material: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default MaterialStallCard;
