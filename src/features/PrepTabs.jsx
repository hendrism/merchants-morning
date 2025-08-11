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
      {/* Market Reports */}
      <div className="space-y-2">
        {gameState.marketReports && gameState.marketReports.length > 0 ? (
          gameState.marketReports.map((report, index) => (
            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">📰 {report}</div>
            </div>
          ))
        ) : (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div className="text-sm text-gray-500">No market news today</div>
          </div>
        )}
      </div>

      {/* Supply Boxes - All 6 types in mobile-friendly grid */}
      <div className="grid grid-cols-2 gap-3 supply-boxes">
        {Object.entries(BOX_TYPES).map(([key, box]) => {
          const affordable = gameState.gold >= box.cost;
          return (
            <button
              key={key}
              onClick={() => openBox(key)}
              disabled={!affordable}
              className={`rounded-xl p-4 text-center transition transform active:scale-95 border-2 flex flex-col items-center text-sm min-h-[100px] ${
                affordable 
                  ? 'bg-gradient-to-tr from-amber-50 to-amber-200 border-amber-500 hover:from-amber-100 hover:to-amber-300' 
                  : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="font-bold text-base mb-1">{box.name}</span>
              <span className="text-amber-700 font-semibold mb-2">{box.cost}g</span>
              <span className="text-xs opacity-80">
                {box.materialCount[0]}-{box.materialCount[1]} materials
              </span>
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
      <div className="text-center pt-4">
        <button
          onClick={onReadyToSell}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-base min-h-[48px] hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          🛒 Ready to Sell Items
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'market', label: 'Market', icon: '📰', description: 'News & Supply Boxes' },
    { id: 'materials', label: 'Materials', icon: '📦', description: 'Your Materials' },
    { id: 'workshop', label: 'Workshop', icon: '⚒️', description: 'Craft Items' },
    { id: 'items', label: 'Items', icon: '🎒', description: 'Your Inventory' },
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
    <div className="prep-tabs-container">
      {/* Top Tab Navigation - Mobile Optimized */}
      <div className="flex gap-2 prep-tabs mb-4 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center flex-none px-4 py-3 rounded-lg border-2 min-w-[90px] transition-all ${
              currentTab === tab.id 
                ? 'bg-gradient-to-tr from-blue-500 to-blue-700 text-white border-blue-500' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-xl mb-1">{tab.icon}</div>
            <div className="text-xs font-medium text-center leading-tight">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="tab-content">{renderContent()}</div>
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
