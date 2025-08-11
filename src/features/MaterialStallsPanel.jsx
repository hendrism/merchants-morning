import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState }) => {
  const [expandedCategories, setExpandedCategories] = useState(['metal', 'wood']); // Start with some expanded
  const [showAll, setShowAll] = useState(false);

  // Group materials by type
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

    // Sort materials within each category by rarity then name
    Object.values(categories).forEach(category => {
      category.materials.sort((a, b) => {
        const rarityOrder = { rare: 3, uncommon: 2, common: 1 };
        const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
    });

    return categories;
  }, [gameState.materials]);

  const toggleCategory = (categoryType) => {
    setExpandedCategories(prev => 
      prev.includes(categoryType) 
        ? prev.filter(c => c !== categoryType)
        : [...prev, categoryType]
    );
  };

  const handleOrganize = () => {
    // Sort categories by total count (most materials first)
    const sortedCategories = Object.keys(materialCategories).sort((a, b) => 
      materialCategories[b].totalCount - materialCategories[a].totalCount
    );
    setExpandedCategories(sortedCategories.slice(0, 2)); // Show top 2 categories
  };

  const handleViewAll = () => {
    if (showAll) {
      setExpandedCategories(['metal', 'wood']); // Reset to defaults
    } else {
      setExpandedCategories(Object.keys(materialCategories)); // Expand all
    }
    setShowAll(!showAll);
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

  if (Object.keys(materialCategories).length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No materials yet</h3>
        <p className="text-gray-600">Buy some supply boxes from the Market to get materials!</p>
      </div>
    );
  }

  return (
    <div className="materials-panel">
      {/* Control buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <button 
          onClick={handleOrganize}
          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          📊 Organize
        </button>
        <button 
          onClick={handleViewAll}
          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          {showAll ? '📋 Collapse' : '👁️ View All'}
        </button>
      </div>

      {/* Material categories */}
      <div className="space-y-3">
        {Object.entries(materialCategories).map(([categoryType, category]) => {
          const isExpanded = expandedCategories.includes(categoryType);
          
          return (
            <div key={categoryType} className="category-group">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(categoryType)}
                className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
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
                    <div className="font-semibold text-left">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.totalCount} items</div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {/* Category materials */}
              {isExpanded && (
                <div className="grid grid-cols-2 gap-2 mt-2 p-2">
                  {category.materials.map(material => (
                    <div
                      key={material.id}
                      className={`p-3 rounded-lg border-2 ${getRarityColor(material.rarity)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{material.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{material.name}</div>
                            <div className="text-xs text-gray-600 capitalize">{material.rarity}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">×{material.count}</div>
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

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
};

export default MaterialStallsPanel;
