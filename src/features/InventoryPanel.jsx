import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TabButton from '../components/TabButton';
import InventoryItemCard from '../components/InventoryItemCard';
import { RECIPES, ITEM_TYPES, ITEM_TYPE_ICONS } from '../constants';

const InventoryPanel = ({
  gameState,
  inventoryTab,
  setInventoryTab,
  filterInventoryByType,
  cardState,
  toggleCategory,
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

  const totalItems = useMemo(
    () => Object.values(gameState.inventory || {}).reduce((s, c) => s + c, 0),
    [gameState.inventory]
  );

  if (!cardState.semiExpanded && !cardState.expanded) {
    return <div>Inventory: {totalItems} items</div>;
  }

  if (cardState.semiExpanded && !cardState.expanded) {
    return (
      <div className="space-y-2">
        {totalItems === 0 && (
          <div className="text-sm text-gray-500 italic">No items yet</div>
        )}
        {ITEM_TYPES.map(type => {
          const items = filterInventoryByType(type);
          const count = items.reduce((s, [, c]) => s + c, 0);
          return (
            <div key={type} className="mb-1">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCategory('inventory', type)}
              >
                <span className="font-semibold">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className="text-sm">{count}</span>
              </div>
              {cardState.categoriesOpen?.[type] && (
                <div className="pl-4 mt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                  {items.map(([itemId, c]) => {
                    const recipe = RECIPES.find(r => r.id === itemId);
                    return (
                      <InventoryItemCard
                        key={itemId}
                        recipe={recipe}
                        count={c}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

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
              aria-label={type.charAt(0).toUpperCase() + type.slice(1)}
            >
              {ITEM_TYPE_ICONS[type]}
            </TabButton>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto">
        {sortedInventory.map(([itemId, count]) => {
          const recipe = RECIPES.find(r => r.id === itemId);
          return (
            <InventoryItemCard key={itemId} recipe={recipe} count={count} />
          );
        })}
        {sortedInventory.length === 0 && (
          <div className="col-span-full">
            <div className="inventory-item-card border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm text-gray-500 italic dark:text-gray-400">
                No {inventoryTab}s crafted yet
              </p>
              <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                Visit the workshop to craft items!
              </p>
            </div>
          </div>
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
  cardState: PropTypes.shape({
    expanded: PropTypes.bool.isRequired,
    semiExpanded: PropTypes.bool.isRequired,
    categoriesOpen: PropTypes.object.isRequired,
  }).isRequired,
  toggleCategory: PropTypes.func.isRequired,
};

export default InventoryPanel;
