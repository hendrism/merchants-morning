import React from 'react';
import PropTypes from 'prop-types';
import { Package, ChevronRight } from 'lucide-react';
import { BOX_TYPES, MATERIALS } from '../constants';

const MorningPhase = ({ gameState, openBox, continueToCrafting, getRarityColor }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Package className="w-4 h-4" />
        Supply Boxes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {Object.entries(BOX_TYPES).map(([type, box]) => (
          <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50">
            <h3 className="font-bold capitalize text-sm mb-1">{box.name}</h3>
            <p className="text-xs text-gray-600 mb-2">
              {box.materialCount[0]}-{box.materialCount[1]} materials
            </p>
            <button
              onClick={() => openBox(type)}
              disabled={gameState.gold < box.cost}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-bold text-sm"
            >
              {box.cost} Gold
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={continueToCrafting}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
      >
        Continue to Crafting <ChevronRight className="w-4 h-4" />
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-bold mb-3">Materials</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(gameState.materials)
          .filter(([_, count]) => count > 0)
          .map(([materialId, count]) => {
            const material = MATERIALS[materialId];
            return (
              <div key={materialId} className={`p-2 rounded text-xs ${getRarityColor(material.rarity)}`}>
                <span className="mr-1">{material.icon}</span>
                {material.name}: {count}
              </div>
            );
          })}
      </div>
    </div>
  </div>
);

MorningPhase.propTypes = {
  gameState: PropTypes.object.isRequired,
  openBox: PropTypes.func.isRequired,
  continueToCrafting: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired
};

export default MorningPhase;
