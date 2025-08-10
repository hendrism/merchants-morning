import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ gameState, filterInventoryByType }) => {
  const categories = useMemo(() => {
    return ITEM_TYPES.map(type => {
      const items = filterInventoryByType(type);
      const count = items.reduce((s, [, c]) => s + c, 0);
      const value = items.reduce((s, [id, c]) => {
        const recipe = RECIPES.find(r => r.id === id);
        return s + (recipe?.sellPrice || 0) * c;
      }, 0);
      return { type, count, value };
    }).filter(c => c.count > 0);
  }, [gameState.inventory, filterInventoryByType]);

  if (categories.length === 0) {
    return <p className="text-center text-sm text-gray-500">No items crafted yet</p>;
  }

  return (
    <div className="space-y-3">
      {categories.map(cat => (
        <div key={cat.type} className="p-3 border rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{ITEM_TYPE_ICONS[cat.type]}</span>
            <span className="font-medium">{cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}</span>
          </div>
          <div className="text-sm text-gray-600">{cat.count} items • {cat.value}g</div>
        </div>
      ))}
    </div>
  );
};

InventoryPanel.propTypes = {
  gameState: PropTypes.object.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
};

export default InventoryPanel;
