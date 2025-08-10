import React from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const rarityClasses = {
  common: 'rarity-common',
  uncommon: 'rarity-uncommon',
  rare: 'rarity-rare',
};

const MaterialStallsPanel = ({ gameState }) => {
  const materials = Object.entries(gameState.materials || {})
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => ({ id, count, ...MATERIALS[id] }));

  if (materials.length === 0) {
    return <p className="text-center text-sm text-gray-500">No materials yet</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 materials-grid">
      {materials.map(mat => (
        <div
          key={mat.id}
          className={`border rounded-lg p-2 flex flex-col items-center ${rarityClasses[mat.rarity]}`}
        >
          <span className="text-xl">{mat.icon}</span>
          <span className="text-xs font-medium">{mat.name}</span>
          <span className="text-xs">{mat.count}</span>
        </div>
      ))}
    </div>
  );
};

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
