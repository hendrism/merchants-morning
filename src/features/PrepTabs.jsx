import React from 'react';
import PropTypes from 'prop-types';
import MaterialStallsPanel from './MaterialStallsPanel';
import Workshop from './Workshop';
import InventoryPanel from './InventoryPanel';
import { BOX_TYPES } from '../constants';

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
  onReadyToSell,
}) => {
  const renderMarket = () => (
    <div className="space-y-4 bg-white rounded-xl shadow p-4">
      <div className="space-y-2">
        {gameState.marketReports.map(r => (
          <div key={r.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm text-blue-800">{r.message}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 supply-boxes">
        {['bronze','silver','gold','platinum'].map(key => {
          const box = BOX_TYPES[key];
          const affordable = gameState.gold >= box.cost;
          return (
            <button
              key={key}
              onClick={() => openBox(key)}
              disabled={!affordable}
              className={`border rounded p-3 flex flex-col items-center justify-center text-sm ${affordable ? 'bg-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <span className="font-semibold">{box.name}</span>
              <span className="text-xs">{box.cost}g</span>
              <span className="text-xs">{box.materialCount[0]}-{box.materialCount[1]} mats</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="bg-white rounded-xl shadow p-4">
      <MaterialStallsPanel gameState={gameState} />
    </div>
  );

  const renderWorkshop = () => (
    <div className="bg-white rounded-xl shadow p-4">
      <Workshop
        gameState={gameState}
        canCraft={canCraft}
        craftItem={craftItem}
        filterRecipesByType={filterRecipesByType}
        sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
      />
    </div>
  );

  const renderItems = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <InventoryPanel gameState={gameState} filterInventoryByType={filterInventoryByType} />
      </div>
      <div className="text-center">
        <button
          onClick={onReadyToSell}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Ready to Sell
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'market', label: 'Market', icon: '📰' },
    { id: 'materials', label: 'Materials', icon: '📦' },
    { id: 'workshop', label: 'Workshop', icon: '⚒️' },
    { id: 'items', label: 'Items', icon: '🎒' },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'market':
        return renderMarket();
      case 'materials':
        return renderMaterials();
      case 'workshop':
        return renderWorkshop();
      case 'items':
        return renderItems();
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`min-w-[80px] px-3 py-2 rounded-lg border-2 flex flex-col items-center text-xs transition-colors ${currentTab === tab.id ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-500' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <div className="text-lg mb-1">{tab.icon}</div>
            <div className="font-medium">{tab.label}</div>
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

PrepTabs.propTypes = {
  currentTab: PropTypes.oneOf(['market','materials','workshop','items']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  gameState: PropTypes.object.isRequired,
  openBox: PropTypes.func.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  onReadyToSell: PropTypes.func.isRequired,
};

export default PrepTabs;
