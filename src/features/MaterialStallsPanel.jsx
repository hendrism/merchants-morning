import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState, getRarityColor, cardState, toggleCategory }) => {
  const totalMaterials = useMemo(
    () => Object.values(gameState.materials || {}).reduce((s, c) => s + c, 0),
    [gameState.materials]
  );

  const materialsByType = useMemo(() => {
    const byType = {};
    Object.entries(gameState.materials || {}).forEach(([id, count]) => {
      if (count <= 0) return;
      const mat = MATERIALS[id];
      if (!mat) return;
      const t = mat.type;
      if (!byType[t]) byType[t] = [];
      byType[t].push({ id, count, ...mat });
    });
    
    // Sort materials within each type by rarity then name
    Object.keys(byType).forEach(type => {
      byType[type].sort((a, b) => {
        const rarityOrder = { rare: 3, uncommon: 2, common: 1 };
        const rarityDiff = (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
        if (rarityDiff !== 0) return rarityDiff;
        return a.name.localeCompare(b.name);
      });
    });
    
    return byType;
  }, [gameState.materials]);

  // Collapsed state - just show total
  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div>Materials: {totalMaterials} total</div>;
  }

  const entries = Object.entries(materialsByType).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📦</div>
        <p className="text-sm text-gray-500 italic dark:text-gray-400">
          No materials yet
        </p>
        <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
          Buy supply boxes to get materials!
        </p>
      </div>
    );
  }

  // Semi-expanded: Show clickable category headers
  if (cardState.semiExpanded && !cardState.expanded) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Material Categories (click to expand)</p>
        <div className="space-y-1">
          {entries.map(([type, materials]) => {
            const count = materials.reduce((s, m) => s + m.count, 0);
            const isExpanded = cardState.expandedCategories.includes(type);
            
            // Get a representative icon for the type
            const typeIcons = {
              metal: '⚙️',
              wood: '🪵', 
              gem: '💎',
              fabric: '🧵',
              beast: '🦫',
              organic: '🌿',
              stone: '🪨',
              magical: '🌌',
              container: '🧪',
              utility: '🪢'
            };
            
            return (
              <div key={type} className="border rounded-lg">
                {/* Category Header - Always Visible */}
                <button
                  onClick={() => toggleCategory('materials', type)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeIcons[type] || '📦'}</span>
                    <div className="text-left">
                      <div className="font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Materials
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
                    <div className="flex flex-wrap gap-2 mt-2">
                      {materials.map(material => {
                        const rarityColors = {
                          common: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200',
                          uncommon: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
                          rare: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200'
                        };

                        return (
                          <div
                            key={material.id}
                            className={`flex items-center gap-2 border-2 px-3 py-2 rounded-full ${rarityColors[material.rarity] || rarityColors.common}`}
                          >
                            <span className="text-lg">{material.icon}</span>
                            <span className="text-sm font-medium">{material.name}</span>
                            <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full dark:bg-gray-200 dark:text-gray-800">
                              {material.count}
                            </span>
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
        <p className="text-sm text-gray-600 dark:text-gray-400">All Materials</p>
        {entries.map(([type, materials]) => {
          const count = materials.reduce((s, m) => s + m.count, 0);
          
          const typeIcons = {
            metal: '⚙️',
            wood: '🪵', 
            gem: '💎',
            fabric: '🧵',
            beast: '🦫',
            organic: '🌿',
            stone: '🪨',
            magical: '🌌',
            container: '🧪',
            utility: '🪢'
          };
          
          return (
            <div key={type} className="border rounded-lg p-3">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">{typeIcons[type] || '📦'}</span>
                <div>
                  <div className="font-medium">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Materials
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {count} items
                  </div>
                </div>
              </div>

              {/* Materials */}
              <div className="flex flex-wrap gap-2">
                {materials.map(material => {
                  const rarityColors = {
                    common: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200',
                    uncommon: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
                    rare: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200'
                  };

                  return (
                    <div
                      key={material.id}
                      className={`flex items-center gap-2 border-2 px-3 py-2 rounded-full ${rarityColors[material.rarity] || rarityColors.common}`}
                    >
                      <span className="text-lg">{material.icon}</span>
                      <span className="text-sm font-medium">{material.name}</span>
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full dark:bg-gray-200 dark:text-gray-800">
                        {material.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

MaterialStallsPanel.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
  getRarityColor: PropTypes.func.isRequired,
  cardState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    semiExpanded: PropTypes.bool.isRequired,
    expandedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  toggleCategory: PropTypes.func.isRequired,
};

export default MaterialStallsPanel;
