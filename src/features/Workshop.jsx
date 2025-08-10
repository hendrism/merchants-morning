import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPES, ITEM_TYPE_ICONS, MATERIALS } from '../constants';

const Workshop = ({ gameState, canCraft, craftItem, filterRecipesByType, sortRecipesByRarityAndCraftability }) => {
  const [tab, setTab] = useState(ITEM_TYPES[0]);
  const recipes = sortRecipesByRarityAndCraftability(filterRecipesByType(tab));

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 overflow-x-auto mb-3">
        {ITEM_TYPES.map(type => (
          <button
            key={type}
            className={`px-3 py-2 rounded-full text-sm flex-shrink-0 ${tab === type ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab(type)}
          >
            {ITEM_TYPE_ICONS[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-2 overflow-y-auto">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className={`border rounded-lg p-3 flex flex-col gap-2 ${canCraft(recipe) ? 'bg-green-50' : 'bg-gray-50 opacity-75'}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{recipe.name}</span>
              <button
                className="px-3 py-1 text-sm rounded bg-blue-500 text-white disabled:opacity-50"
                disabled={!canCraft(recipe)}
                onClick={() => craftItem(recipe.id)}
              >
                Craft
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(recipe.ingredients).map(([id, count]) => (
                <span key={id} className="flex items-center gap-1">
                  {MATERIALS[id].icon} {count}/{gameState.materials[id] || 0}
                </span>
              ))}
            </div>
          </div>
        ))}
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
