import React from 'react';
import { Hammer, Store } from 'lucide-react';
import { MATERIALS, RECIPES, ITEM_TYPES, RARITY_ORDER } from '../constants';
import TabButton from '../components/TabButton';

const CraftingPanel = ({
  gameState,
  craftingTab,
  setCraftingTab,
  inventoryTab,
  setInventoryTab,
  canCraft,
  craftItem,
  filterRecipesByType,
  sortRecipesByRarityAndCraftability,
  filterInventoryByType,
  openShop,
  getRarityColor,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Hammer className="w-4 h-4" />
        Crafting Workshop
      </h2>

      <div className="flex gap-1 mb-3">
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
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabButton>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-80 overflow-y-auto">
        {sortRecipesByRarityAndCraftability(filterRecipesByType(craftingTab)).map(recipe => (
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
                <h4 className={`font-bold text-xs ${canCraft(recipe) ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{recipe.name}</h4>
                <p className={`text-xs px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                  {recipe.rarity}
                </p>
              </div>
              <button
                onClick={() => craftItem(recipe.id)}
                disabled={!canCraft(recipe)}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  canCraft(recipe)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {canCraft(recipe) ? '✓ Craft' : '✗ Need Materials'}
              </button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(recipe.ingredients).map(([mat, count]) => {
                const have = gameState.materials[mat] || 0;
                const hasEnough = have >= count;
                return (
                  <span key={mat} className={`mr-2 ${hasEnough ? 'text-green-600' : 'text-red-600'}`}>
                    {MATERIALS[mat].icon}{count}({have})
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={openShop}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
      >
        Open Shop <Store className="w-4 h-4" />
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h3 className="text-lg font-bold mb-3">Inventory</h3>

      <div className="flex gap-1 mb-3">
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

      <div className="space-y-2">
        {filterInventoryByType(inventoryTab)
          .sort(([itemIdA], [itemIdB]) => {
            const recipeA = RECIPES.find(r => r.id === itemIdA);
            const recipeB = RECIPES.find(r => r.id === itemIdB);
            return RARITY_ORDER[recipeB.rarity] - RARITY_ORDER[recipeA.rarity];
          })
          .map(([itemId, count]) => {
            const recipe = RECIPES.find(r => r.id === itemId);
            return (
              <div key={itemId} className={`p-2 rounded text-xs border ${getRarityColor(recipe.rarity)}`}>
                <div className="font-bold">{recipe.name}</div>
                <div className="text-gray-600 dark:text-gray-300">Stock: {count} • {recipe.sellPrice}g each</div>
              </div>
            );
          })}
        {filterInventoryByType(inventoryTab).length === 0 && (
          <p className="text-xs text-gray-500 italic dark:text-gray-400">No {inventoryTab}s crafted yet</p>
        )}
      </div>
    </div>
  </div>
);

export default CraftingPanel;
