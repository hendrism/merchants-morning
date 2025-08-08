import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TabButton from '../components/TabButton';
import { RECIPES, ITEM_TYPES } from '../constants';

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
    [inventoryTab, filterInventoryByType]
  );

  return (
    <div>
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
        {ITEM_TYPES.map(type => {
          const count = filterInventoryByType(type).length;
          return (
            <TabButton
              key={type}
              active={inventoryTab === type}
              onClick={() => setInventoryTab(type)}
              count={count}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabButton>
          );
        })}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {sortedInventory.map(([itemId, count]) => {
          const recipe = RECIPES.find(r => r.id === itemId);
          return (
            <div key={itemId} className={`p-2 rounded text-sm sm:text-xs border ${getRarityColor(recipe.rarity)}`}>
              <div className="font-bold">{recipe.name}</div>
              <div className="text-gray-600 dark:text-gray-300">Stock: {count} • {recipe.sellPrice}g each</div>
            </div>
          );
        })}
        {sortedInventory.length === 0 && (
          <p className="text-sm sm:text-xs text-gray-500 italic dark:text-gray-400">No {inventoryTab}s crafted yet</p>
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
