import React, { useMemo, useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'items'

  const totalItems = useMemo(
    () => Object.values(gameState.inventory || {}).reduce((s, c) => s + c, 0),
    [gameState.inventory]
  );

  // Reset view when card collapses/expands
  React.useEffect(() => {
    if (!cardState.semiExpanded && !cardState.expanded) {
      setCurrentView('categories');
      setSelectedCategory(null);
    } else if (cardState.semiExpanded && !cardState.expanded) {
      setCurrentView('categories');
    }
  }, [cardState.semiExpanded, cardState.expanded]);

  // Smart header click behavior - built into the parent component
  const handleCategoryClick = (type) => {
    setSelectedCategory(type);
    setCurrentView('items');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div>Inventory: {totalItems} items</div>;
  }

  // Categories view (chip badges)
  if (currentView === 'categories') {
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

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Select Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ type, count }) => (
            <button
              key={type}
              onClick={() => handleCategoryClick(type)}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 rounded-full transition-colors dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-800"
            >
              <span>{ITEM_TYPE_ICONS[type]}</span>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-100">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Items view (Option C - Large Action Chips)
  if (currentView === 'items' && selectedCategory) {
    const items = filterInventoryByType(selectedCategory);

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {ITEM_TYPE_ICONS[selectedCategory]} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Items
          </h3>
          <button 
            onClick={handleBackToCategories}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Categories
          </button>
        </div>

        {/* Large Action Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(([itemId, count]) => {
            const recipe = RECIPES.find(r => r.id === itemId);
            const totalValue = recipe.sellPrice * count;

            return (
              <div 
                key={itemId} 
                className="bg-gray-100 border border-gray-300 rounded-xl p-3 hover:shadow-md transition-all dark:bg-gray-700 dark:border-gray-600"
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Stock:</span>
                    <span className="font-medium">×{count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Price Each:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{recipe.sellPrice}g</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-2">
                    <span className="text-gray-600 dark:text-gray-300">Total Value:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{totalValue}g</span>
                  </div>
                </div>

                {/* Action button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium text-sm mt-3 transition-colors">
                  Manage Item
                </button>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm text-gray-500 italic dark:text-gray-400">
              No {selectedCategory} items crafted yet
            </p>
            <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
              Visit the workshop to craft {selectedCategory} items!
            </p>
          </div>
        )}
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
