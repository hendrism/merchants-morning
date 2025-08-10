import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
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
  cardState,
  toggleCategory,
}) => {
  const totalCraftable = useMemo(
    () => RECIPES.filter(canCraft).length,
    [gameState.materials, canCraft]
  );
  const totalRecipes = RECIPES.length;

  const renderRecipeCard = (recipe) => (
    <div
      key={recipe.id}
      className={`border rounded-lg p-3 ${
        canCraft(recipe)
          ? 'border-green-300 bg-green-50 dark:bg-green-900 dark:border-green-700'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 opacity-75'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4
            className={`font-bold text-sm ${
              canCraft(recipe)
                ? 'text-black dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {recipe.name}
          </h4>
          <p
            className={`text-xs px-2 py-1 rounded inline-block mb-2 border ${getRarityColor(
              recipe.rarity
            )}`}
          >
            {recipe.rarity}
          </p>
        </div>
        <button
          onClick={() => craftItem(recipe.id)}
          disabled={!canCraft(recipe)}
          className={`px-3 py-1 rounded font-bold min-h-[44px] text-sm ${
            canCraft(recipe)
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {canCraft(recipe) ? '✓ Craft' : '✗ Need Materials'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
        {Object.entries(recipe.ingredients).map(([mat, count]) => {
          const have = gameState.materials[mat] || 0;
          const hasEnough = have >= count;
          return (
            <span key={mat} className={`${hasEnough ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {MATERIALS[mat].icon} {count}/{have}
            </span>
          );
        })}
      </div>
    </div>
  );

  // Collapsed state
  if (!cardState.semiExpanded && !cardState.expanded) {
    return (
      <div>
        Craftable: {totalCraftable} / Recipes: {totalRecipes}
      </div>
    );
  }

  const categories = ITEM_TYPES.map(type => {
    const allRecipes = filterRecipesByType(type);
    const craftableCount = allRecipes.filter(canCraft).length;
    const totalCount = allRecipes.length;
    return { type, allRecipes, craftableCount, totalCount };
  }).filter(c => c.totalCount > 0);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🔨</div>
        <p className="text-sm text-gray-500 italic dark:text-gray-400">
          No recipes available
        </p>
      </div>
    );
  }

  // Semi-expanded: Show clickable category headers
  if (cardState.semiExpanded && !cardState.expanded) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Recipe Categories (click to expand)</p>
        <div className="space-y-1">
          {categories.map(({ type, craftableCount, totalCount }) => {
            const isExpanded = cardState.expandedCategories.includes(type);
            const sortedRecipes = isExpanded ? sortRecipesByRarityAndCraftability(filterRecipesByType(type)) : [];

            return (
              <div key={type} className="border rounded-lg">
                {/* Category Header - Always Visible */}
                <button
                  onClick={() => toggleCategory('workshop', type)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ITEM_TYPE_ICONS[type]}</span>
                    <div className="text-left">
                      <div className="font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Recipes
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {craftableCount}/{totalCount} craftable
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 max-h-80 overflow-y-auto">
                      {sortedRecipes.map(renderRecipeCard)}
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
        <p className="text-sm text-gray-600 dark:text-gray-400">All Recipes</p>
        {categories.map(({ type, craftableCount, totalCount }) => {
          const sortedRecipes = sortRecipesByRarityAndCraftability(filterRecipesByType(type));

          return (
            <div key={type} className="border rounded-lg p-3">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">{ITEM_TYPE_ICONS[type]}</span>
                <div>
                  <div className="font-medium">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Recipes
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {craftableCount}/{totalCount} craftable
                  </div>
                </div>
              </div>

              {/* Recipes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedRecipes.map(renderRecipeCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
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
  cardState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    semiExpanded: PropTypes.bool.isRequired,
    expandedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  toggleCategory: PropTypes.func.isRequired,
};

export default Workshop;
