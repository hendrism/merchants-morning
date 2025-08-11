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
    <div className="space-y-4">
      <div className="space-y-2">
        {gameState.marketReports.map(r => (
          <div key={r.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm text-blue-800">{r.message}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 supply-boxes">
        {['bronze', 'silver', 'gold', 'platinum'].map(key => {
          const box = BOX_TYPES[key];
          const affordable = gameState.gold >= box.cost;
          return (
            <button
              key={key}
              onClick={() => openBox(key)}
              disabled={!affordable}
              className={`rounded-xl p-4 text-center transition transform active:scale-95 border-2 flex flex-col items-center text-sm ${affordable ? 'bg-gradient-to-tr from-amber-50 to-amber-200 border-amber-500' : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}`}
            >
              <span className="font-bold">{box.name}</span>
              <span className="text-xs text-amber-700 mb-1">{box.cost}g</span>
              <span className="text-[0.65rem] opacity-80">{box.materialCount[0]}-{box.materialCount[1]} mats</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMaterials = () => <MaterialStallsPanel gameState={gameState} />;

  const renderWorkshop = () => (
    <Workshop
      gameState={gameState}
      canCraft={canCraft}
      craftItem={craftItem}
      filterRecipesByType={filterRecipesByType}
      sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
    />
  );

  const renderItems = () => (
    <div className="space-y-4">
      <InventoryPanel gameState={gameState} filterInventoryByType={filterInventoryByType} />
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
      <div className="flex gap-2 prep-tabs mb-4 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center flex-none px-3 py-2 rounded-lg border-2 min-w-[80px] transition-colors ${currentTab === tab.id ? 'bg-gradient-to-tr from-blue-500 to-blue-700 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <div className="text-lg mb-0.5">{tab.icon}</div>
            <div className="text-xs font-medium">{tab.label}</div>
          </button>
        ))}
      </div>
      <div className="space-y-4">{renderContent()}</div>
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
