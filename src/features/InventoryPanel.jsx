import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ gameState, filterInventoryByType }) => {
  const summary = ITEM_TYPES.map(type => {
    const items = filterInventoryByType(type);
    const totalCount = items.reduce((s, [, c]) => s + c, 0);
    const totalValue = items.reduce((s, [id, c]) => {
      const recipe = RECIPES.find(r => r.id === id);
      return s + (recipe?.sellPrice || 0) * c;
    }, 0);
    return { type, totalCount, totalValue };
  }).filter(s => s.totalCount > 0);

  if (summary.length === 0) {
    return <p className="text-center text-sm text-gray-500">No items yet</p>;
  }

  return (
    <div className="space-y-2">
      {summary.map(({ type, totalCount, totalValue }) => (
        <div key={type} className="p-4 border rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ITEM_TYPE_ICONS[type]}</span>
            <div>
              <div className="font-bold">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
              <div className="text-xs text-gray-500">
                {totalCount} items • {totalValue}g
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-gray-200 rounded min-h-[44px] text-sm">View</button>
            <button className="px-3 py-2 bg-blue-500 text-white rounded min-h-[44px] text-sm">Ready to Sell</button>
          </div>
        </div>
      ))}
    </div>
  );
};

InventoryPanel.propTypes = {
  gameState: PropTypes.shape({ inventory: PropTypes.object.isRequired }).isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
};

export default InventoryPanel;
