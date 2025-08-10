import React from 'react';
import PropTypes from 'prop-types';
import MaterialStallsPanel from './MaterialStallsPanel';
import Workshop from './Workshop';
import InventoryPanel from './InventoryPanel';
import { BOX_TYPES } from '../constants';

const PrepTabs = ({ currentTab, onTabChange, gameState, openBox, canCraft, craftItem }) => {
  const tabs = [
    { id: 'market', label: 'Market', icon: '📰' },
    { id: 'materials', label: 'Materials', icon: '📦' },
    { id: 'workshop', label: 'Workshop', icon: '⚒️' },
    { id: 'items', label: 'Items', icon: '🎒' },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'market':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {(gameState.marketReports || []).map((r, i) => (
                <div key={i} className="p-3 bg-blue-100 text-blue-800 rounded">
                  {r}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 supply-boxes">
              {Object.entries(BOX_TYPES).map(([id, box]) => (
                <button
                  key={id}
                  onClick={() => openBox(id)}
                  disabled={gameState.gold < box.cost}
                  className={`border rounded p-3 text-sm flex flex-col items-center gap-1 min-h-[44px] ${gameState.gold < box.cost ? 'opacity-50' : 'bg-white'} `}
                >
                  <span>{box.name}</span>
                  <span className="text-xs">{box.cost}g</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'materials':
        return <MaterialStallsPanel materials={gameState.materials} />;
      case 'workshop':
        return <Workshop gameState={gameState} canCraft={canCraft} craftItem={craftItem} />;
      case 'items':
        return <InventoryPanel inventory={gameState.inventory} />;
      default:
        return null;
    }
  };

  return (
    <div className="prep-tabs">
      <div className="flex gap-2 overflow-x-auto mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-3 py-2 rounded-full flex items-center gap-1 min-w-[44px] ${currentTab === t.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <span>{t.icon}</span>
            <span className="text-sm whitespace-nowrap">{t.label}</span>
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
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
};

export default PrepTabs;
