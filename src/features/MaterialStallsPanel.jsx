import React from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState }) => {
  const materials = Object.entries(gameState.materials || {})
    .filter(([, count]) => count > 0);

  if (materials.length === 0) {
    return <p className="text-center text-sm text-gray-500">No materials yet</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 materials-grid">
      {materials.map(([id, count]) => {
        const mat = MATERIALS[id];
        return (
          <div
            key={id}
            className={`border rounded-full flex flex-col items-center p-2 rarity-${mat.rarity}`}
          >
            <span className="text-lg">{mat.icon}</span>
            <span className="text-xs font-medium">{mat.name}</span>
            <span className="text-xs">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
