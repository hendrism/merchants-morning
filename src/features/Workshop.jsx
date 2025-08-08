import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TabButton from '../components/TabButton';
import { MATERIALS, RECIPES, ITEM_TYPES, ITEM_TYPE_ICONS } from '../constants';

const Workshop = ({
  gameState,
  craftingTab,
  setCraftingTab,
  canCraft,
  craftItem,
  filterRecipesByType,
  sortRecipesByRarityAndCraftability,
  getRarityColor,
}) => {
  const sortedRecipes = useMemo(
    () => sortRecipesByRarityAndCraftability(filterRecipesByType(craftingTab)),
    [craftingTab, gameState.materials, filterRecipesByType, sortRecipesByRarityAndCraftability]
  );

  return (
    <div>
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {ITEM_TYPES.map(type => {
          const allRecipes = filterRecipesByType(type);
          const craftableCount = allRecipes.filter(canCraft).length;
          const totalCount = allRecipes.length;
          return (
            <TabButton
              key={type}
              active={craftingTab === type}
              onClick={() => setCraftingTab(type)}
              count={`${craftableCount}/${totalCount}`}
              aria-label={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              {ITEM_TYPE_ICONS[type]}
            </TabButton>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-80 overflow-y-auto">
        {sortedRecipes.map(recipe => (
          <div
            key={recipe.id}
            className={`border rounded-lg p-2 ${
              canCraft(recipe)
                ? 'border-green-300 bg-green-50 dark:bg-green-900'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h4 className={`font-bold text-sm sm:text-xs ${canCraft(recipe) ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{recipe.name}</h4>
                <p className={`text-sm px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                  {recipe.rarity}
                </p>
              </div>
              <button
                onClick={() => craftItem(recipe.id)}
                disabled={!canCraft(recipe)}
                className={`px-2 py-1 rounded font-bold min-h-[44px] min-w-[44px] text-sm sm:text-xs ${
                  canCraft(recipe)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {canCraft(recipe) ? '✓ Craft' : '✗ Need Materials'}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm sm:text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(recipe.ingredients).map(([mat, count]) => {
                const have = gameState.materials[mat] || 0;
                const hasEnough = have >= count;
                return (
                  <span key={mat} className={`${hasEnough ? 'text-green-600' : 'text-red-600'}`}>
                    {MATERIALS[mat].icon} {count}/{have}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Workshop.propTypes = {
  gameState: PropTypes.shape({
    materials: PropTypes.object.isRequired,
  }).isRequired,
  craftingTab: PropTypes.string.isRequired,
  setCraftingTab: PropTypes.func.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default Workshop;
