import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MaterialStallsPanel from './MaterialStallsPanel';
import Workshop from './Workshop';
import InventoryPanel from './InventoryPanel';
import { BOX_TYPES } from '../constants';

const tabs = [
  { id: 'market', label: 'Market', icon: '📰' },
  { id: 'materials', label: 'Materials', icon: '📦' },
  { id: 'workshop', label: 'Workshop', icon: '🔨' },
  { id: 'items', label: 'Items', icon: '🎒' },
];

const PrepTabs = ({
  currentTab,
  onTabChange,
  gameState,
  openBox,
  canCraft,
  craftItem,
  filterRecipesByType,
  sortRecipesByRarityAndCraftability,
  filterInventoryByType,
  getRarityColor,
}) => {
  const [craftingTab, setCraftingTab] = useState('weapon');

  return (
    <div className="prep-tabs">
      <div className="flex overflow-x-auto border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 min-h-[44px] ${currentTab === tab.id ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4">
        {currentTab === 'market' && (
          <div className="space-y-4">
            <div className="space-y-2">
              {(gameState.marketReports || []).map((report, idx) => (
                <div key={idx} className="p-3 border-l-4 border-blue-400 bg-blue-50 text-sm">
                  {report}
                </div>
              ))}
              {(gameState.marketReports || []).length === 0 && (
                <p className="text-center text-sm text-gray-500">No market news today</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 supply-boxes">
              {Object.entries(BOX_TYPES).map(([id, box]) => (
                <button
                  key={id}
                  onClick={() => openBox(id)}
                  disabled={(gameState.gold || 0) < box.cost}
                  className={`border rounded p-4 flex flex-col items-center gap-1 min-h-[44px] ${
                    (gameState.gold || 0) < box.cost ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                  }`}
                >
                  <span className="font-bold">{box.name}</span>
                  <span className="text-sm">{box.cost}g</span>
                  <span className="text-xs">{box.materialCount[0]}-{box.materialCount[1]} mats</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {currentTab === 'materials' && <MaterialStallsPanel gameState={gameState} />}
        {currentTab === 'workshop' && (
          <Workshop
            gameState={gameState}
            craftingTab={craftingTab}
            setCraftingTab={setCraftingTab}
            canCraft={canCraft}
            craftItem={craftItem}
            filterRecipesByType={filterRecipesByType}
            sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
            getRarityColor={getRarityColor}
          />
        )}
        {currentTab === 'items' && (
          <InventoryPanel
            gameState={gameState}
            filterInventoryByType={filterInventoryByType}
          />
        )}
      </div>
    </div>
  );
};

PrepTabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  gameState: PropTypes.object.isRequired,
  openBox: PropTypes.func.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default PrepTabs;
