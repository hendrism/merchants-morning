import React, { useMemo, useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'items'

  const totalCraftable = useMemo(
    () => RECIPES.filter(canCraft).length,
    [gameState.materials, canCraft]
  );
  const totalRecipes = RECIPES.length;

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
    // Also set the crafting tab for consistency
    setCraftingTab(type);
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

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

  if (!cardState.semiExpanded && !cardState.expanded) {
    return (
      <div>
        Craftable: {totalCraftable} / Recipes: {totalRecipes}
      </div>
    );
  }

  // Categories view (chip badges)
  if (currentView === 'categories') {
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

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">Select Recipe Type</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ type, craftableCount, totalCount }) => (
            <button
              key={type}
              onClick={() => handleCategoryClick(type)}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 rounded-full transition-colors dark:bg-amber-900 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-800"
            >
              <span>{ITEM_TYPE_ICONS[type]}</span>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-100">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                {craftableCount}/{totalCount}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Items view (recipe cards)
  if (currentView === 'items' && selectedCategory) {
    const sortedRecipes = useMemo(
      () => sortRecipesByRarityAndCraftability(filterRecipesByType(selectedCategory)),
      [selectedCategory, gameState.materials, filterRecipesByType, sortRecipesByRarityAndCraftability]
    );

    return (
      <div className="space-y-4">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {ITEM_TYPE_ICONS[selectedCategory]} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Recipes
          </h3>
          <button 
            onClick={handleBackToCategories}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Categories
          </button>
        </div>

        {/* Recipe cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {sortedRecipes.map(renderRecipeCard)}
        </div>

        {sortedRecipes.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔨</div>
            <p className="text-sm text-gray-500 italic dark:text-gray-400">
              No {selectedCategory} recipes available
            </p>
          </div>
        )}
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
