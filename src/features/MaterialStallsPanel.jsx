import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MERCHANT_STALLS, MATERIALS } from '../constants';
import TabButton from '../components/TabButton';
import MaterialStallCard from '../components/MaterialStallCard';
import useMaterialStalls from '../hooks/useMaterialStalls';

const MaterialStallsPanel = ({ gameState, getRarityColor, cardState, toggleCategory }) => {
  const { materialsByStall, getStallMaterialCount, getActiveStalls } = useMaterialStalls(
    gameState.materials
  );
  const activeStalls = getActiveStalls();
  const [activeStall, setActiveStall] = useState(activeStalls[0] || 'blacksmith');
  const [manualSelection, setManualSelection] = useState(false);

  const totalMaterials = useMemo(
    () => Object.values(gameState.materials || {}).reduce((s, c) => s + c, 0),
    [gameState.materials]
  );

  const materialsByType = useMemo(() => {
    const byType = {};
    Object.entries(gameState.materials || {}).forEach(([id, count]) => {
      if (count <= 0) return;
      const mat = MATERIALS[id];
      if (!mat) return;
      const t = mat.type;
      if (!byType[t]) byType[t] = [];
      byType[t].push({ id, count, ...mat });
    });
    return byType;
  }, [gameState.materials]);

  // Switch to first available stall if current one becomes empty, unless user manually selected an empty stall
  React.useEffect(() => {
    if (!manualSelection && activeStalls.length > 0 && !activeStalls.includes(activeStall)) {
      setActiveStall(activeStalls[0]);
    }

    if (activeStalls.includes(activeStall)) {
      setManualSelection(false);
    }
  }, [activeStalls, activeStall, manualSelection]);

  const activeStallData = MERCHANT_STALLS[activeStall];
  const activeMaterials = materialsByStall[activeStall] || [];

  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div className="material-stalls-panel">Materials: {totalMaterials} total</div>;
  }

  if (cardState.semiExpanded && !cardState.expanded) {
    const entries = Object.entries(materialsByType).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    if (entries.length === 0) {
      return (
        <div className="material-stalls-panel space-y-2">
          <div className="text-sm italic text-gray-500">No items yet</div>
        </div>
      );
    }

    return (
      <div className="material-stalls-panel space-y-2">
        {entries.map(([type, mats]) => {
          const count = mats.reduce((s, m) => s + m.count, 0);
          return (
            <div key={type} className="mb-1">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCategory('materials', type)}
              >
                <span className="font-semibold">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="text-sm">{count}</span>
              </div>
              {cardState.categoriesOpen?.[type] && (
                <div className="pl-4 mt-1 space-y-1">
                  {mats.map(mat => (
                    <div key={mat.id} className="flex justify-between text-sm">
                      <span>
                        {mat.icon} {mat.name}
                      </span>
                      <span>{mat.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="material-stalls-panel">
      {/* Stall Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(MERCHANT_STALLS).map(([stallId, stall]) => {
          const materialCount = getStallMaterialCount(stallId);
          return (
            <TabButton
              key={stallId}
              active={activeStall === stallId}
              onClick={() => {
                setActiveStall(stallId);
                setManualSelection(true);
              }}
              count={materialCount}
              theme={stall.theme}
              aria-label={stall.name}
            >
              <div className="tab-icon">{stall.icon}</div>
              <div className="tab-name">{stall.name}</div>
            </TabButton>
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
  cardState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    semiExpanded: PropTypes.bool.isRequired,
    categoriesOpen: PropTypes.object.isRequired,
  }).isRequired,
  toggleCategory: PropTypes.func.isRequired,
};

export default MaterialStallsPanel;
