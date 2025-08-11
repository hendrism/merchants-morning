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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-sm font-semibold">
          <span><strong>{getTotalInventoryCount()}</strong> items</span>
          <span><strong>{getTotalInventoryValue()}g</strong> total value</span>
        </div>
      </div>

      {/* Item categories - ENHANCED CATEGORY HEADERS */}
      <div className="space-y-3">
        {Object.entries(inventoryCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* ENHANCED Category header - MORE PROMINENT */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md border-2 border-green-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-white bg-opacity-20 p-2 rounded-lg">
                    {category.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-lg text-white">{category.name}</div>
                    <div className="text-sm text-green-100">{category.totalCount} items • {category.totalValue}g value</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.items.length} types
                  </div>
                  <div className="text-white text-lg">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </button>

              {/* Category items - ENHANCED */}
              {isExpanded && (
                <div className="bg-gray-50 p-3 rounded-lg mt-2 border-2 border-gray-200">
                  <div className="grid grid-cols-1 gap-2">
                    {category.items.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg">{ITEM_TYPE_ICONS[item.type]}</span>
                            <span className="font-semibold text-gray-800">{item.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                              item.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                              item.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.rarity}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {item.sellPrice}g each
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-800">×{item.count}</div>
                          <div className="text-sm text-green-600 font-medium">{(item.sellPrice * item.count)}g</div>
                        </div>
                      </div>
                    ))}
                  </div>
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
