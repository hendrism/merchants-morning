import React from 'react';
import PropTypes from 'prop-types';
import { BOX_TYPES } from '../constants';
import MaterialStallsPanel from './MaterialStallsPanel';
import Workshop from './Workshop';
import InventoryPanel from './InventoryPanel';

const tabs = [
  { key: 'market', label: 'Market', icon: '📰' },
  { key: 'materials', label: 'Materials', icon: '📦' },
  { key: 'workshop', label: 'Workshop', icon: '🔨' },
  { key: 'items', label: 'Items', icon: '🎒' },
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
}) => {
  const renderContent = () => {
    switch (currentTab) {
      case 'market':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {gameState.marketReports.map((r, i) => (
                <div key={i} className="p-2 bg-blue-100 rounded text-sm">{r}</div>
              ))}
              {gameState.marketReports.length === 0 && (
                <p className="text-sm text-gray-500">No news today</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 supply-boxes">
              {Object.entries(BOX_TYPES).map(([id, box]) => (
                <button
                  key={id}
                  onClick={() => openBox(id)}
                  disabled={gameState.gold < box.cost}
                  className="border rounded p-3 flex flex-col items-center active:scale-95 disabled:opacity-50"
                >
                  <span className="font-medium">{box.name}</span>
                  <span className="text-sm">{box.cost}g</span>
                  <span className="text-xs">
                    {box.materialCount[0]}-{box.materialCount[1]} mats
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'materials':
        return <MaterialStallsPanel gameState={gameState} />;
      case 'workshop':
        return (
          <Workshop
            gameState={gameState}
            canCraft={canCraft}
            craftItem={craftItem}
            filterRecipesByType={filterRecipesByType}
            sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
          />
        );
      case 'items':
        return <InventoryPanel gameState={gameState} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-x-auto prep-tabs mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`flex-1 px-3 py-2 text-sm flex flex-col items-center ${
              currentTab === t.key ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

PrepTabs.propTypes = {
  currentTab: PropTypes.oneOf(['market', 'materials', 'workshop', 'items']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  gameState: PropTypes.object.isRequired,
  openBox: PropTypes.func.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
};

export default PrepTabs;
