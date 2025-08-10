import React from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const rarityClass = {
  common: 'rarity-common',
  uncommon: 'rarity-uncommon',
  rare: 'rarity-rare',
};

const MaterialStallsPanel = ({ materials }) => {
  const entries = Object.entries(materials).filter(([, c]) => c > 0);
  if (entries.length === 0) {
    return <p className="text-center text-sm text-gray-500">No materials yet</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-2 materials-grid">
      {entries.map(([id, count]) => {
        const mat = MATERIALS[id];
        return (
          <div key={id} className={`flex flex-col items-center border p-2 rounded ${rarityClass[mat.rarity]}`}>
            <span className="text-xl">{mat.icon}</span>
            <span className="text-xs text-center">{mat.name}</span>
            <span className="text-xs font-bold">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

MaterialStallsPanel.propTypes = {
  materials: PropTypes.object.isRequired,
};

export default MaterialStallsPanel;
