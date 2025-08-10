import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState }) => {
  const materials = useMemo(() => {
    return Object.entries(gameState.materials || {})
      .filter(([, count]) => count > 0)
      .map(([id, count]) => ({ id, count, ...MATERIALS[id] }));
  }, [gameState.materials]);

  if (materials.length === 0) {
    return <p className="text-center text-sm text-gray-500">No materials yet</p>;
  }

  return (
    <div>
      <div className="flex justify-end gap-2 mb-3">
        <button className="px-3 py-2 text-xs bg-gray-200 rounded">Organize</button>
        <button className="px-3 py-2 text-xs bg-gray-200 rounded">View All</button>
      </div>
      <div className="grid gap-2 materials-grid">
        {materials.map(mat => (
          <div
            key={mat.id}
            className={`border-2 rounded p-2 text-center rarity-${mat.rarity}`}
          >
            <div className="text-lg">{mat.icon}</div>
            <div className="text-xs font-medium">{mat.name}</div>
            <div className="text-xs">×{mat.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
