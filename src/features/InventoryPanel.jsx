import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TabButton from '../components/TabButton';
import { RECIPES, ITEM_TYPES, ITEM_TYPE_ICONS } from '../constants';

const InventoryPanel = ({
  gameState,
  inventoryTab,
  setInventoryTab,
  filterInventoryByType,
  getRarityColor,
}) => {
  const sortedInventory = useMemo(
    () =>
      filterInventoryByType(inventoryTab)
        .slice()
        .sort(([itemIdA], [itemIdB]) => {
          const recipeA = RECIPES.find(r => r.id === itemIdA);
          const recipeB = RECIPES.find(r => r.id === itemIdB);
          return recipeB.rarity.localeCompare(recipeA.rarity);
        }),
    [inventoryTab, gameState.inventory, filterInventoryByType]
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {ITEM_TYPES.map(type => {
          const count = filterInventoryByType(type).length;
          return (
            <TabButton
              key={type}
              active={inventoryTab === type}
              onClick={() => setInventoryTab(type)}
              count={count}
              aria-label={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              <div className="tab-icon">{ITEM_TYPE_ICONS[type]}</div>
              <div className="tab-name capitalize">{type}</div>
            </TabButton>
          );
        })}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
        {sortedInventory.map(([itemId, count]) => {
          const recipe = RECIPES.find(r => r.id === itemId);
          return (
            <div
              key={itemId}
              className={`relative flex flex-col items-center justify-end h-20 border rounded ${getRarityColor(recipe.rarity)}`}
            >
              <div className="flex flex-col-reverse items-center">
                {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
                  <span key={i} className="text-xl leading-none">
                    {ITEM_TYPE_ICONS[recipe.type]}
                  </span>
                ))}
              </div>
              {count > 5 && <span className="absolute top-1 right-1 text-xs">+{count - 5}</span>}
              <span className="sr-only">{recipe.name} x{count}</span>
            </div>
          );
        })}
        {sortedInventory.length === 0 && (
          <p className="text-sm sm:text-xs text-gray-500 italic dark:text-gray-400 col-span-full">No {inventoryTab}s crafted yet</p>
        )}
      </div>
    </div>
  );
};

InventoryPanel.propTypes = {
  gameState: PropTypes.shape({
    inventory: PropTypes.object.isRequired,
  }).isRequired,
  inventoryTab: PropTypes.string.isRequired,
  setInventoryTab: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default InventoryPanel;
