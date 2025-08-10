import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MERCHANT_STALLS, MATERIALS } from '../constants';
import TabButton from '../components/TabButton';
import MaterialStallCard from '../components/MaterialStallCard';
import useMaterialStalls from '../hooks/useMaterialStalls';

const MaterialStallsPanel = ({ gameState, getRarityColor, cardState, toggleCategory }) => {
  const { materialsByStall, getStallMaterialCount, getActiveStalls } = useMaterialStalls(gameState.materials);
  const activeStalls = getActiveStalls();
  const [activeStall, setActiveStall] = useState(activeStalls[0] || 'blacksmith');
  const [manualSelection, setManualSelection] = useState(false);

  // Collapsed & semi-expanded data
  const totalMaterials = useMemo(
    () => Object.values(gameState.materials).reduce((sum, c) => sum + c, 0),
    [gameState.materials]
  );

  const materialsByType = useMemo(() => {
    const groups = {};
    Object.entries(gameState.materials).forEach(([id, count]) => {
      if (count <= 0) return;
      const material = MATERIALS[id];
      if (!material) return;
      const type = material.type;
      if (!groups[type]) groups[type] = [];
      groups[type].push({ id, ...material, count });
    });
    Object.values(groups).forEach(list =>
      list.sort((a, b) => {
        const rarityOrder = { rare: 3, uncommon: 2, common: 1 };
        const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      })
    );
    return groups;
  }, [gameState.materials]);

  // Collapsed view
  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div className="text-sm text-gray-600">Materials: {totalMaterials} total</div>;
  }

  // Semi-expanded view
  if (cardState.semiExpanded && !cardState.expanded) {
    return (
      <div className="space-y-2">
        {Object.entries(materialsByType).map(([type, mats]) => {
          const total = mats.reduce((s, m) => s + m.count, 0);
          const isOpen = cardState.categoriesOpen[type];
          return (
            <div key={type}>
              <button
                type="button"
                className="w-full flex justify-between items-center font-medium text-left"
                onClick={() => toggleCategory('materials', type)}
              >
                <span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}: {total}
                </span>
                <span>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {mats.map(m => (
                    <div key={m.id} className="flex items-center gap-1 text-sm">
                      <span>{m.icon}</span>
                      <span>
                        {m.name} x{m.count}
                      </span>
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

  // Expanded view (existing interface)
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
