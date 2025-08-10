import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, MATERIALS } from '../constants';

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
  const recipes = sortRecipesByRarityAndCraftability(
    filterRecipesByType(craftingTab)
  );

  return (
    <div>
      <div className="flex overflow-x-auto gap-2 mb-4">
        {ITEM_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setCraftingTab(type)}
            className={`px-3 py-2 rounded-full min-h-[44px] whitespace-nowrap ${
              craftingTab === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {ITEM_TYPE_ICONS[type]} {type}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {recipes.map(recipe => {
          const craftable = canCraft(recipe);
          return (
            <div
              key={recipe.id}
              className={`p-3 rounded border flex justify-between items-start ${
                craftable
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white opacity-75'
              }`}
            >
              <div className="flex-1 mr-2">
                <div className="font-bold text-sm">{recipe.name}</div>
                <div
                  className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getRarityColor(
                    recipe.rarity
                  )}`}
                >
                  {recipe.rarity}
                </div>
                <div className="flex flex-wrap gap-1 text-xs mt-1">
                  {Object.entries(recipe.ingredients).map(([mat, count]) => {
                    const have = gameState.materials[mat] || 0;
                    return (
                      <span
                        key={mat}
                        className={`${have >= count ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {MATERIALS[mat].icon} {count}/{have}
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => craftItem(recipe.id)}
                disabled={!craftable}
                className={`px-3 py-1 rounded min-h-[44px] text-sm ${
                  craftable
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                Craft
              </button>
            </div>
          );
        })}
        {recipes.length === 0 && (
          <p className="text-center text-sm text-gray-500">No recipes available</p>
        )}
      </div>
    </div>
  );
};

Workshop.propTypes = {
  gameState: PropTypes.shape({ materials: PropTypes.object.isRequired }).isRequired,
  craftingTab: PropTypes.string.isRequired,
  setCraftingTab: PropTypes.func.isRequired,
  canCraft: PropTypes.func.isRequired,
  craftItem: PropTypes.func.isRequired,
  filterRecipesByType: PropTypes.func.isRequired,
  sortRecipesByRarityAndCraftability: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default Workshop;
