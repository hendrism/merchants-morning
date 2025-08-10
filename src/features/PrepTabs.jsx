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
      <div className="flex prep-tabs border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2 text-center ${currentTab === tab.id ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          >
            <div className="text-lg">{tab.icon}</div>
            <div className="text-xs">{tab.label}</div>
          </button>
        ))}
      </div>
      <div className="p-4">{renderContent()}</div>
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
