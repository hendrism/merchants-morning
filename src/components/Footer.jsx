import React from 'react';
import PropTypes from 'prop-types';
import { Coins } from 'lucide-react';
import { MATERIALS } from '../constants';

const Footer = ({ gameState, getTopMaterials }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-yellow-600">
          <Coins className="w-4 h-4" />
          {gameState.gold}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {getTopMaterials().map(([materialId, count]) => {
            const material = MATERIALS[materialId];
            return (
              <div key={materialId} className="flex items-center gap-1 text-xs whitespace-nowrap">
                <span>{material.icon}</span>
                <span className="font-medium">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-gray-500">
          Day {gameState.day}
        </div>
      </div>
    </div>
  </div>
);

Footer.propTypes = {
  gameState: PropTypes.object.isRequired,
  getTopMaterials: PropTypes.func.isRequired,
};

export default Footer;
