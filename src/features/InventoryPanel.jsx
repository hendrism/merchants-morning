import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RECIPES, ITEM_TYPES, ITEM_TYPE_ICONS } from '../constants';

const InventoryPanel = ({
  gameState,
  inventoryTab,
  setInventoryTab,
  filterInventoryByType,
  getRarityColor,
  cardState,
  toggleCategory,
}) => {
  const totalItems = useMemo(
    () => Object.values(gameState.inventory || {}).reduce((s, c) => s + c, 0),
    [gameState.inventory]
  );

  // Collapsed state
  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div>Inventory: {totalItems} items</div>;
  }

  const categories = ITEM_TYPES.map(type => {
    const items = filterInventoryByType(type);
    const count = items.reduce((s, [, c]) => s + c, 0);
    return { type, items, count };
  }).filter(c => c.count > 0);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-sm text-gray-500 italic dark:text-gray-400">
          No items crafted yet
        </p>
        <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
          Visit the workshop to craft items!
        </p>
      </div>
    );
  }

  // Semi-expanded: Show clickable category headers
  if (cardState.semiExpanded && !cardState.expanded) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Categories (click to expand)</p>
        <div className="space-y-1">
          {categories.map(({ type, items, count }) => {
            const isExpanded = cardState.expandedCategories.includes(type);

            return (
              <div key={type} className="border rounded-lg">
                {/* Category Header - Always Visible */}
                <button
                  onClick={() => toggleCategory('inventory', type)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ITEM_TYPE_ICONS[type]}</span>
                    <div className="text-left">
                      <div className="font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Items
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {count} items
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </button>

                {/* Expanded Category Content */}
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                      {items.map(([itemId, count]) => {
                        const recipe = RECIPES.find(r => r.id === itemId);
                        const totalValue = recipe.sellPrice * count;

                        return (
                          <div 
                            key={itemId} 
                            className="bg-gray-100 border border-gray-300 rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600"
                          >
                            {/* Item header */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">{ITEM_TYPE_ICONS[recipe.type]}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{recipe.name}</div>
                                <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${getRarityColor(recipe.rarity)}`}>
                                  {recipe.rarity}
                                </div>
                              </div>
                            </div>

                            {/* Stock and pricing */}
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                                <span className="font-medium">×{count}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-300">Price Each:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">{recipe.sellPrice}g</span>
                              </div>
                              <div className="flex items-center justify-between border-t pt-2">
                                <span className="text-gray-600 dark:text-gray-300">Total Value:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">{totalValue}g</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fully expanded: Show everything at once
  if (cardState.expanded) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">All Inventory Items</p>
        {categories.map(({ type, items, count }) => (
          <div key={type} className="border rounded-lg p-3">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">{ITEM_TYPE_ICONS[type]}</span>
              <div>
                <div className="font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Items
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {count} items
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(([itemId, count]) => {
                const recipe = RECIPES.find(r => r.id === itemId);
                const totalValue = recipe.sellPrice * count;

                return (
                  <div 
                    key={itemId} 
                    className="bg-gray-100 border border-gray-300 rounded-xl p-3 dark:bg-gray-700 dark:border-gray-600"
                  >
                    {/* Item header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{ITEM_TYPE_ICONS[recipe.type]}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{recipe.name}</div>
                        <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${getRarityColor(recipe.rarity)}`}>
                          {recipe.rarity}
                        </div>
                      </div>
                    </div>

                    {/* Stock and pricing */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                        <span className="font-medium">×{count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Price Each:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{recipe.sellPrice}g</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-gray-600 dark:text-gray-300">Total Value:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{totalValue}g</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

InventoryPanel.propTypes = {
  gameState: PropTypes.shape({
    inventory: PropTypes.object.isRequired,
  }).isRequired,
  inventoryTab: PropTypes.string.isRequired,
  setInventoryTab: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
  cardState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    semiExpanded: PropTypes.bool.isRequired,
    expandedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  toggleCategory: PropTypes.func.isRequired,
};

export default InventoryPanel;
