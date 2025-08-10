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

  return (
    <div>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {ITEM_TYPES.map(t => (
          <button
            key={t}
            className={`px-3 py-2 rounded-full text-sm ${tab === t ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTab(t)}
          >
            {ITEM_TYPE_ICONS[t]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className={`p-3 border rounded ${canCraft(recipe) ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm">{recipe.name}</div>
                <div className="flex flex-wrap gap-1 text-xs mt-1">
                  {Object.entries(recipe.ingredients).map(([id, cnt]) => {
                    const have = gameState.materials[id] || 0;
                    const has = have >= cnt;
                    return (
                      <span key={id} className={has ? 'text-green-600' : 'text-red-600'}>
                        {MATERIALS[id].icon} {cnt}/{have}
                      </span>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => craftItem(recipe.id)}
                disabled={!canCraft(recipe)}
                className={`px-3 py-1 rounded text-sm ${canCraft(recipe) ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}
              >
                Craft
              </button>
            </div>
          </div>
        ))}
        {recipes.length === 0 && (
          <p className="text-sm text-gray-500 text-center">No recipes</p>
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
