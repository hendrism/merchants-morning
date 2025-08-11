import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState }) => {
  const [expandedCategories, setExpandedCategories] = useState(['metal', 'wood']);
  const [sortMode, setSortMode] = useState('type'); // 'type', 'rarity', 'count'

  const materialCategories = useMemo(() => {
    const categories = {};
    
    Object.entries(gameState.materials || {}).forEach(([materialId, count]) => {
      if (count <= 0) return;
      
      const material = MATERIALS[materialId];
      if (!material) return;
      
      const category = material.type;
      if (!categories[category]) {
        categories[category] = {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          materials: [],
          totalCount: 0
        };
      }
      
      categories[category].materials.push({
        id: materialId,
        ...material,
        count
      });
      categories[category].totalCount += count;
    });

    // Sort materials within each category
    Object.values(categories).forEach(category => {
      category.materials.sort((a, b) => {
        if (sortMode === 'rarity') {
          const rarityOrder = { rare: 3, uncommon: 2, common: 1 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        } else if (sortMode === 'count') {
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });
    });

    return categories;
  }, [gameState.materials, sortMode]);

  const toggleCategory = (categoryType) => {
    setExpandedCategories(prev => 
      prev.includes(categoryType) 
        ? prev.filter(c => c !== categoryType)
        : [...prev, categoryType]
    );
  };

  const handleOrganize = () => {
    // Cycle through sort modes and show visual feedback
    const modes = ['type', 'rarity', 'count'];
    const currentIndex = modes.indexOf(sortMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setSortMode(nextMode);
    
    // Auto-expand categories with most items when organizing
    if (nextMode === 'count') {
      const sortedCategories = Object.entries(materialCategories)
        .sort(([,a], [,b]) => b.totalCount - a.totalCount)
        .slice(0, 3)
        .map(([key]) => key);
      setExpandedCategories(sortedCategories);
    }
  };

  const handleViewAll = () => {
    const allCategories = Object.keys(materialCategories);
    if (expandedCategories.length === allCategories.length) {
      setExpandedCategories(['metal', 'wood']); // Collapse to defaults
    } else {
      setExpandedCategories(allCategories); // Expand all
    }
  };

  if (Object.keys(materialCategories).length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-gray-600">Buy supply boxes to get materials!</p>
      </div>
    );
  }

  return (
    <div className="materials-panel">
      {/* Control buttons */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600">
          Sort: <span className="font-medium capitalize">{sortMode}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOrganize}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            📊 Sort: {sortMode === 'type' ? 'Rarity' : sortMode === 'rarity' ? 'Count' : 'Type'}
          </button>
          <button 
            onClick={handleViewAll}
            className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {expandedCategories.length === Object.keys(materialCategories).length ? '📋 Collapse' : '👁️ Expand All'}
          </button>
        </div>
      </div>

      {/* Material categories - ENHANCED CATEGORY HEADERS */}
      <div className="space-y-3">
        {Object.entries(materialCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* ENHANCED Category header - MORE PROMINENT */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md border-2 border-blue-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-white bg-opacity-20 p-2 rounded-lg">
                    {categoryType === 'metal' && '⚙️'}
                    {categoryType === 'wood' && '🌳'}
                    {categoryType === 'fabric' && '🧵'}
                    {categoryType === 'beast' && '🦫'}
                    {categoryType === 'stone' && '🪨'}
                    {categoryType === 'organic' && '🌿'}
                    {categoryType === 'gem' && '💎'}
                    {categoryType === 'magical' && '🌟'}
                    {categoryType === 'container' && '🧪'}
                    {categoryType === 'utility' && '🪢'}
                  </span>
                  <div className="text-left">
                    <div className="font-bold text-lg text-white">{category.name}</div>
                    <div className="text-sm text-blue-100">{category.totalCount} total materials</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                    {category.materials.length} types
                  </div>
                  <div className="text-white text-lg">
                    {isExpanded ? '▼' : '▶'}
                  </div>
                </div>
              </button>

              {/* Category materials - CONDENSED */}
              {isExpanded && (
                <div className="bg-gray-50 p-3 rounded-lg mt-2 border-2 border-gray-200">
                  <div className="grid grid-cols-1 gap-2">
                    {category.materials.map(material => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{material.icon}</span>
                          <div>
                            <span className="font-semibold text-gray-800">{material.name}</span>
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full font-medium ${
                              material.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                              material.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {material.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="font-bold text-lg text-gray-800">×{material.count}</div>
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

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
