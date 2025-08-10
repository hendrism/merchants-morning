import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ gameState }) => {
  const summaries = ITEM_TYPES.map(type => {
    const items = Object.entries(gameState.inventory || {})
      .filter(([id, count]) => count > 0)
      .filter(([id]) => {
        const recipe = RECIPES.find(r => r.id === id);
        return recipe && recipe.type === type;
      });
    if (items.length === 0) return null;
    const count = items.reduce((s, [, c]) => s + c, 0);
    const value = items.reduce((s, [id, c]) => {
      const recipe = RECIPES.find(r => r.id === id);
      return s + (recipe?.sellPrice || 0) * c;
    }, 0);
    return { type, count, value };
  }).filter(Boolean);

  if (summaries.length === 0) {
    return <p className="text-center text-sm text-gray-500">No crafted items</p>;
  }

  return (
    <div className="space-y-2">
      {summaries.map(s => (
        <div key={s.type} className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{ITEM_TYPE_ICONS[s.type]}</span>
            <span className="font-medium">
              {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
            </span>
          </div>
          <div className="text-sm text-gray-600">{s.count} items • {s.value}g</div>
        </div>
      ))}
    </div>
  );
};

InventoryPanel.propTypes = {
  gameState: PropTypes.shape({
    inventory: PropTypes.object.isRequired,
  }).isRequired,
};

export default InventoryPanel;
