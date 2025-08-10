import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RECIPES, ITEM_TYPE_ICONS, PROFESSIONS } from '../constants';

const matchClass = (info) => {
  if (!info) return 'wrong-type';
  if (info.exactMatch) return 'perfect-match';
  if (info.status === 'upgrade') return 'good-match';
  if (info.status === 'downgrade') return 'poor-match';
  if (info.status === 'cant_afford') return 'wrong-type';
  return info.status === 'wrong_type' ? 'wrong-type' : 'poor-match';
};

const ShopInterface = ({
  gameState,
  selectedCustomer,
  setSelectedCustomer,
  filterInventoryByType,
  sortByMatchQualityAndRarity,
  serveCustomer,
  getRarityColor,
  getSaleInfo,
}) => {
  const waitingCustomers = gameState.customers.filter(c => !c.satisfied);

  const inventory = useMemo(() => {
    if (!selectedCustomer) return [];
    return sortByMatchQualityAndRarity(
      filterInventoryByType(selectedCustomer.requestType),
      selectedCustomer
    );
  }, [gameState.inventory, selectedCustomer, filterInventoryByType, sortByMatchQualityAndRarity]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {waitingCustomers.map(c => {
          const isSelected = selectedCustomer?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className={`px-3 py-2 rounded-full min-h-[44px] whitespace-nowrap border ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {c.name.split(' ')[0]} {ITEM_TYPE_ICONS[c.requestType]}
            </button>
          );
        })}
      </div>

      {selectedCustomer && (
        <div className="p-4 border rounded-lg">
          <div className="font-bold">{selectedCustomer.name}</div>
          <div className="text-sm">
            Wants {selectedCustomer.requestRarity} {selectedCustomer.requestType} • Budget {selectedCustomer.maxBudget}g
          </div>
          <div className="text-xs text-gray-500">
            Prefers {Object.values(PROFESSIONS[selectedCustomer.profession]?.preferences || {})
              .filter(p => p.length)
              .map(p => p.join('/'))
              .join(', ') || 'varied items'}
          </div>
        </div>
      )}

      {selectedCustomer ? (
        <div className="grid gap-2 grid-cols-2 sale-items-grid">
          {inventory.map(([itemId, count]) => {
            const recipe = RECIPES.find(r => r.id === itemId);
            const info = getSaleInfo(recipe, selectedCustomer);
            return (
              <button
                key={itemId}
                onClick={() => serveCustomer(selectedCustomer.id, itemId)}
                className={`p-2 border rounded text-left ${matchClass(info)}`}
              >
                <div className="font-bold text-sm">{recipe.name}</div>
                <div className={`text-xs mt-1 ${getRarityColor(recipe.rarity)}`}>{recipe.rarity}</div>
                <div className="text-xs mt-1">{count}x</div>
              </button>
            );
          })}
          {inventory.length === 0 && (
            <div className="col-span-2 text-center text-sm text-gray-500">No matching items</div>
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">Select a customer to see items</p>
      )}
    </div>
  );
};

ShopInterface.propTypes = {
  gameState: PropTypes.shape({
    customers: PropTypes.array.isRequired,
    inventory: PropTypes.object.isRequired,
  }).isRequired,
  selectedCustomer: PropTypes.object,
  setSelectedCustomer: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  sortByMatchQualityAndRarity: PropTypes.func.isRequired,
  serveCustomer: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
  getSaleInfo: PropTypes.func.isRequired,
};

export default ShopInterface;
