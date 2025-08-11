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

      {/* Material categories - CONDENSED */}
      <div className="space-y-2">
        {Object.entries(materialCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* Category header - MORE COMPACT */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
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
                  <div>
                    <div className="font-medium text-sm text-left">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.totalCount} total</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* Category materials - VERY CONDENSED */}
              {isExpanded && (
                <div className="bg-gray-50 p-2 rounded space-y-1">
                  {category.materials.map(material => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{material.icon}</span>
                        <span className="font-medium">{material.name}</span>
                        <span className={`text-xs px-1 rounded ${
                          material.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                          material.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {material.rarity.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="font-bold">×{material.count}</div>
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

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
