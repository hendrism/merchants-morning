import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ gameState, filterInventoryByType }) => {
  const [expandedCategories, setExpandedCategories] = useState(['weapon', 'armor']); // Start with some expanded

  // Group inventory by item type
  const inventoryCategories = useMemo(() => {
    const categories = {};
    
    ITEM_TYPES.forEach(type => {
      const items = filterInventoryByType(type);
      if (items.length === 0) return;
      
      const totalCount = items.reduce((sum, [, count]) => sum + count, 0);
      const totalValue = items.reduce((sum, [id, count]) => {
        const recipe = RECIPES.find(r => r.id === id);
        return sum + (recipe?.sellPrice || 0) * count;
      }, 0);
      
      // Sort items by rarity (rare first) then by name
      const sortedItems = items.map(([id, count]) => {
        const recipe = RECIPES.find(r => r.id === id);
        return { ...recipe, count };
      }).sort((a, b) => {
        const rarityOrder = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
        const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
      
      categories[type] = {
        name: type.charAt(0).toUpperCase() + type.slice(1) + 's',
        icon: ITEM_TYPE_ICONS[type],
        items: sortedItems,
        totalCount,
        totalValue
      };
    });
    
    return categories;
  }, [gameState.inventory, filterInventoryByType]);

  const toggleCategory = (categoryType) => {
    setExpandedCategories(prev => 
      prev.includes(categoryType) 
        ? prev.filter(c => c !== categoryType)
        : [...prev, categoryType]
    );
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'border-gray-300 bg-gray-50',
      uncommon: 'border-green-300 bg-green-50',
      rare: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return colors[rarity] || colors.common;
  };

  const getTotalInventoryValue = () => {
    return Object.values(inventoryCategories).reduce((sum, cat) => sum + cat.totalValue, 0);
  };

  const getTotalInventoryCount = () => {
    return Object.values(inventoryCategories).reduce((sum, cat) => sum + cat.totalCount, 0);
  };

  if (Object.keys(inventoryCategories).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎒</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No items crafted yet</h3>
        <p className="text-gray-600">Visit the Workshop to craft some items to sell!</p>
      </div>
    );
  }

  return (
    <div className="inventory-panel">
      {/* Summary stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Inventory Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-blue-700">Total Items:</div>
            <div className="font-bold text-blue-900">{getTotalInventoryCount()}</div>
          </div>
          <div>
            <div className="text-blue-700">Total Value:</div>
            <div className="font-bold text-blue-900">{getTotalInventoryValue()}g</div>
          </div>
        </div>
      </div>

      {/* Item categories */}
      <div className="space-y-3">
        {Object.entries(inventoryCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <div className="font-semibold text-left">{category.name}</div>
                    <div className="text-sm text-gray-600">
                      {category.totalCount} items • {category.totalValue}g value
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* Category items */}
              {isExpanded && (
                <div className="space-y-2 mt-2 p-2">
                  {category.items.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border-2 ${getRarityColor(item.rarity)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {item.rarity} • {item.sellPrice}g each
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">×{item.count}</div>
                          <div className="text-sm text-green-600 font-medium">
                            {(item.sellPrice * item.count)}g total
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

InventoryPanel.propTypes = {
  gameState: PropTypes.object.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
};

export default InventoryPanel;
