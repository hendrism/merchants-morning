import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS } from '../constants';

const MaterialStallsPanel = ({ gameState, getRarityColor, cardState, toggleCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'items'

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

  // Reset view when card collapses/expands
  React.useEffect(() => {
    if (!cardState.semiExpanded && !cardState.expanded) {
      setCurrentView('categories');
      setSelectedCategory(null);
    } else if (cardState.semiExpanded && !cardState.expanded) {
      setCurrentView('categories');
    }
  }, [cardState.semiExpanded, cardState.expanded]);

  const handleCategoryClick = (type) => {
    setSelectedCategory(type);
    setCurrentView('items');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div>Materials: {totalMaterials} total</div>;
  }

  // Categories view (chip badges)
  if (currentView === 'categories') {
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

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Select Material Type</p>
        <div className="flex flex-wrap gap-2">
          {entries.map(([type, materials]) => {
            const count = materials.reduce((s, m) => s + m.count, 0);
            
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
              <button
                key={type}
                onClick={() => handleCategoryClick(type)}
                className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 rounded-full transition-colors dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-800"
              >
                <span>{typeIcons[type] || '📦'}</span>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-100">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Items view (rarity-colored chips)
  if (currentView === 'items' && selectedCategory) {
    const materials = materialsByType[selectedCategory] || [];

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Materials
          </h3>
          <button 
            onClick={handleBackToCategories}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Categories
          </button>
        </div>

        {/* Rarity-colored material chips */}
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

        {materials.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm text-gray-500 italic dark:text-gray-400">
              No {selectedCategory} materials
            </p>
            <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
              Buy supply boxes to get more materials!
            </p>
          </div>
        )}
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
