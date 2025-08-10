import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ inventory }) => {
  const categories = ITEM_TYPES.map(t => {
    const items = Object.entries(inventory).filter(([id, c]) => c > 0 && RECIPES.find(r => r.id === id)?.type === t);
    const count = items.reduce((s, [, c]) => s + c, 0);
    const value = items.reduce((s, [id, c]) => s + (RECIPES.find(r => r.id === id).sellPrice * c), 0);
    return { type: t, count, value };
  });
  return (
    <div className="space-y-2">
      {categories.filter(c => c.count > 0).map(c => (
        <div key={c.type} className="p-3 border rounded flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{ITEM_TYPE_ICONS[c.type]}</span>
            <span className="capitalize text-sm">{c.type}</span>
          </div>
          <div className="text-sm">{c.count} items • {c.value}g</div>
        </div>
      ))}
      {categories.every(c => c.count === 0) && (
        <p className="text-center text-sm text-gray-500">No items crafted yet</p>
      )}
    </div>
  );
};

InventoryPanel.propTypes = {
  inventory: PropTypes.object.isRequired,
};

export default InventoryPanel;
