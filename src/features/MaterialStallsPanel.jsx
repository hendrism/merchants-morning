import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MERCHANT_STALLS } from '../constants';
import StallTab from '../components/StallTab';
import MaterialStallCard from '../components/MaterialStallCard';
import useMaterialStalls from '../hooks/useMaterialStalls';

const MaterialStallsPanel = ({ gameState, getRarityColor }) => {
  const { materialsByStall, getStallMaterialCount, getActiveStalls } = useMaterialStalls(gameState.materials);
  const activeStalls = getActiveStalls();
  const [activeStall, setActiveStall] = useState(activeStalls[0] || 'blacksmith');
  const [manualSelection, setManualSelection] = useState(false);

  // Switch to first available stall if current one becomes empty, but allow manual selection of empty stalls
  React.useEffect(() => {
    if (manualSelection) {
      setManualSelection(false);
      return;
    }
    if (activeStalls.length > 0 && !activeStalls.includes(activeStall)) {
      setActiveStall(activeStalls[0]);
    }
  }, [activeStalls, activeStall, manualSelection]);

  const activeStallData = MERCHANT_STALLS[activeStall];
  const activeMaterials = materialsByStall[activeStall] || [];

  return (
    <div className="material-stalls-panel">
      {/* Stall Tabs */}
      <div className="stall-tabs">
        {Object.entries(MERCHANT_STALLS).map(([stallId, stall]) => {
          const materialCount = getStallMaterialCount(stallId);
          return (
            <StallTab
              key={stallId}
              stall={stall}
              isActive={activeStall === stallId}
              materialCount={materialCount}
              onClick={() => {
                setActiveStall(stallId);
                setManualSelection(true);
              }}
            />
          );
        })}
      </div>

      {/* Active Stall Content */}
      <div className={`stall-content stall-${activeStallData.theme}`}>
        {/* Stall Header */}
        <div className="stall-header">
          <div className="stall-keeper">
            <div className="keeper-icon">{activeStallData.icon}</div>
            <div className="keeper-info">
              <div className="keeper-name">{activeStallData.keeper}</div>
              <div className="keeper-greeting">"{activeStallData.greeting}"</div>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="materials-grid">
          {activeMaterials.map(material => (
            <MaterialStallCard
              key={material.id}
              material={material}
              getRarityColor={getRarityColor}
            />
          ))}
        </div>

        {/* Empty State */}
        {activeMaterials.length === 0 && (
          <div className="empty-stall">
            <div className="empty-icon">📦</div>
            <div className="empty-text">
              No materials at {activeStallData.name}'s stall
            </div>
            <div className="empty-subtitle">
              Visit other merchants or buy supply boxes!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default MaterialStallsPanel;
