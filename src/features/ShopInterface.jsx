import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RECIPES } from '../constants';

const ShopInterface = ({
  gameState,
  selectedCustomer = null,
  setSelectedCustomer,
  filterInventoryByType,
  sortByMatchQualityAndRarity,
  serveCustomer,
  getSaleInfo,
}) => {
  const waitingCustomers = gameState.customers.filter(c => !c.satisfied);

  const items = useMemo(() => {
    if (!selectedCustomer) return [];
    return sortByMatchQualityAndRarity(
      filterInventoryByType(selectedCustomer.requestType),
      selectedCustomer
    );
  }, [selectedCustomer, gameState.inventory, filterInventoryByType, sortByMatchQualityAndRarity]);

  const getMatchClass = (info) => {
    if (!info) return 'wrong-type';
    if (!info.canAfford) return 'poor-match';
    if (info.exactMatch) return 'perfect-match';
    if (info.isPreferred) return 'good-match';
    return 'poor-match';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {waitingCustomers.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCustomer(c)}
            className={`px-3 py-2 rounded-full border ${selectedCustomer?.id === c.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            {c.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {selectedCustomer && (
        <div className="p-3 border rounded">
          <div className="font-semibold">{selectedCustomer.name}</div>
          <div className="text-sm text-gray-600">
            Wants {selectedCustomer.requestRarity} {selectedCustomer.requestType} • Budget {selectedCustomer.maxBudget}g
          </div>
        </div>
      )}

      <div className="grid gap-2 sale-items-grid">
        {selectedCustomer ? (
          items.map(([id, count]) => {
            const recipe = RECIPES.find(r => r.id === id);
            const info = getSaleInfo(recipe, selectedCustomer);
            return (
              <button
                key={id}
                onClick={() => serveCustomer(selectedCustomer.id, id)}
                disabled={!info.canAfford}
                className={`p-2 border rounded text-left text-sm ${getMatchClass(info)}`}
              >
                <div className="font-medium">{recipe.name}</div>
                <div className="text-xs">x{count} • {recipe.sellPrice}g</div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 col-span-2">Select a customer</p>
        )}
      </div>
    </div>
  );
};

ShopInterface.propTypes = {
  gameState: PropTypes.object.isRequired,
  selectedCustomer: PropTypes.object,
  setSelectedCustomer: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  sortByMatchQualityAndRarity: PropTypes.func.isRequired,
  serveCustomer: PropTypes.func.isRequired,
  getSaleInfo: PropTypes.func.isRequired,
};

export default ShopInterface;
