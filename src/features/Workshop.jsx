import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { MATERIALS, ITEM_TYPES, ITEM_TYPE_ICONS } from '../constants';

const Workshop = ({
  gameState,
  canCraft,
  craftItem,
  filterRecipesByType,
  sortRecipesByRarityAndCraftability,
}) => {
  const [tab, setTab] = useState(ITEM_TYPES[0]);

  const recipes = useMemo(() => {
    return sortRecipesByRarityAndCraftability(filterRecipesByType(tab));
  }, [tab, filterRecipesByType, sortRecipesByRarityAndCraftability, gameState.materials]);

  // Calculate craftable counts for each tab
  const tabCounts = useMemo(() => {
    const counts = {};
    ITEM_TYPES.forEach(type => {
      const allRecipes = filterRecipesByType(type);
      const craftableCount = allRecipes.filter(canCraft).length;
      const totalCount = allRecipes.length;
      counts[type] = { craftable: craftableCount, total: totalCount };
    });
    return counts;
  }, [filterRecipesByType, canCraft, gameState.materials]);

  return (
    <div>
      {/* Enhanced tabs with craftable counts */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {ITEM_TYPES.map(type => {
          const counts = tabCounts[type];
          const isActive = tab === type;
          
          return (
            <button
              key={type}
              className={`flex flex-col items-center px-4 py-3 rounded-lg text-sm font-medium min-w-[90px] transition-all ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setTab(type)}
            >
              <span className="text-xl mb-1">{ITEM_TYPE_ICONS[type]}</span>
              <span className="text-xs capitalize">{type}</span>
              <span className={`text-xs mt-1 px-2 py-1 rounded-full ${
                isActive 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : counts.craftable > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
              }`}>
                {counts.craftable}/{counts.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recipe list */}
      <div className="space-y-3">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className={`p-3 border rounded-lg ${canCraft(recipe) ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{recipe.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    recipe.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                    recipe.rarity === 'rare' ? 'bg-purple-100 text-purple-700' :
                    recipe.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {recipe.rarity}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  {Object.entries(recipe.ingredients).map(([materialId, count]) => {
                    const have = gameState.materials[materialId] || 0;
                    const hasEnough = have >= count;
                    return (
                      <span key={materialId} className={`flex items-center gap-1 px-2 py-1 rounded ${
                        hasEnough 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span>{MATERIALS[materialId].icon}</span>
                        <span>{count}/{have}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => craftItem(recipe.id)}
                disabled={!canCraft(recipe)}
                className={`px-4 py-2 rounded-lg font-bold min-h-[44px] min-w-[80px] text-sm transition-all ${
                  canCraft(recipe)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canCraft(recipe) ? '🔨 Craft' : '❌ Missing'}
              </button>
            </div>
          </div>
        ))}
        {recipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No {tab} recipes available</p>
          </div>
        )}
      </div>
    </div>
  );
};

Workshop.propTypes = {
  gameState: PropTypes.object.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
};

export default Workshop;
