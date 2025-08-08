import React from 'react';
import PropTypes from 'prop-types';

const MaterialCard = ({ material, count }) => (
  <div className={`material-card rarity-${material.rarity}`}>
    <div className="visual-stack">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div
          key={i}
          className="stack-item"
          style={{
            transform: `translateY(${i * -4}px) translateX(${i * 2}px)`,
            zIndex: 10 - i,
            opacity: 1 - i * 0.1,
            filter: `drop-shadow(${i}px ${i}px 2px rgba(0,0,0,0.3))`,
          }}
        >
          <span className="text-xl leading-none">{material.icon}</span>
        </div>
      ))}
      {count > 5 && <span className="more-indicator">...</span>}
    </div>
    <span className="quantity-badge">{count}</span>
  </div>
);

MaterialCard.propTypes = {
  material: PropTypes.shape({
    icon: PropTypes.node,
    rarity: PropTypes.string,
  }).isRequired,
  count: PropTypes.number.isRequired,
};

export default MaterialCard;
