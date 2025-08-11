import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, RECIPES } from '../constants';

const InventoryPanel = ({ gameState, filterInventoryByType }) => {
  const [expandedCategories, setExpandedCategories] = useState(['weapon', 'armor']);

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

  const getTotalInventoryValue = () => {
    return Object.values(inventoryCategories).reduce((sum, cat) => sum + cat.totalValue, 0);
  };

  const getTotalInventoryCount = () => {
    return Object.values(inventoryCategories).reduce((sum, cat) => sum + cat.totalCount, 0);
  };

  if (Object.keys(inventoryCategories).length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🎒</div>
        <p className="text-gray-600">Craft items in the Workshop!</p>
      </div>
    );
  }

  return (
    <div className="inventory-panel">
      {/* Compact summary */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
        <div className="flex justify-between text-sm">
          <span><strong>{getTotalInventoryCount()}</strong> items</span>
          <span><strong>{getTotalInventoryValue()}g</strong> total value</span>
        </div>
      </div>

      {/* Item categories - CONDENSED */}
      <div className="space-y-2">
        {Object.entries(inventoryCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* Category header - COMPACT */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <div className="font-medium text-sm text-left">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.totalCount} items • {category.totalValue}g</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* Category items - VERY CONDENSED */}
              {isExpanded && (
                <div className="bg-gray-50 p-2 rounded space-y-1">
                  {category.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-600 flex gap-2">
                          <span className={`px-1 rounded ${
                            item.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                            item.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.rarity.charAt(0).toUpperCase()}
                          </span>
                          <span>{item.sellPrice}g each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">×{item.count}</div>
                        <div className="text-xs text-green-600">{(item.sellPrice * item.count)}g</div>
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
