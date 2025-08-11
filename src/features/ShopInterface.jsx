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
    if (!info || !info.canAfford) return 'item-cant-afford';
    if (info.exactMatch && info.isPreferred) return 'item-perfect-match';
    if (info.exactMatch) return 'item-exact-match';
    if (info.isPreferred) return 'item-preferred';
    if (info.status === 'upgrade') return 'item-upgrade';
    return 'item-basic-match';
  };

  const getMatchText = (info) => {
    if (!info || !info.canAfford) return "Can't afford";
    if (info.exactMatch && info.isPreferred) return 'Perfect match!';
    if (info.exactMatch) return 'Exact match';
    if (info.isPreferred) return 'Preferred style';
    if (info.status === 'upgrade') return 'Quality upgrade';
    return 'Basic match';
  };

  const getBudgetDisplay = (customer) => {
    const tierColors = {
      wealthy: 'bg-green-500',
      middle: 'bg-yellow-500', 
      budget: 'bg-red-500'
    };
    return (
      <span className={`inline-block w-3 h-3 rounded-full ${tierColors[customer.budgetTier] || 'bg-gray-500'}`}></span>
    );
  };

  if (waitingCustomers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">All customers served!</h2>
        <p className="text-gray-600">Great work today. Time to close up shop.</p>
      </div>
    );
  }

  return (
    <div className="shop-interface space-y-4">
      {/* Customer Selection - Horizontal Scrolling Cards */}
      <div className="customer-selection">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          👥 Waiting Customers ({waitingCustomers.length})
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2 customer-cards">
          {waitingCustomers.map(customer => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className={`flex-none w-48 p-4 rounded-xl border-2 text-left transition-all ${
                selectedCustomer?.id === customer.id 
                  ? 'bg-blue-50 border-blue-500 shadow-lg' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-800">{customer.name.split(' ')[0]}</span>
                {getBudgetDisplay(customer)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Wants: {customer.requestRarity} {customer.requestType}</div>
                <div>Budget: {customer.maxBudget}g</div>
                <div className="text-xs text-gray-500">{customer.profession}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div className="selected-customer bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-blue-900">{selectedCustomer.name}</h4>
              <p className="text-sm text-blue-700">
                Looking for {selectedCustomer.requestRarity} {selectedCustomer.requestType} • Budget: {selectedCustomer.maxBudget}g
              </p>
            </div>
            <button
              onClick={() => setSelectedCustomer(null)}
              className="text-blue-600 hover:text-blue-800 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Items for Sale */}
      <div className="items-for-sale">
        {selectedCustomer ? (
          <>
            <h4 className="font-semibold mb-3 text-gray-800">
              🎒 Your {selectedCustomer.requestType}s ({items.length} available)
            </h4>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sale-items-grid">
                {items.map(([id, count]) => {
                  const recipe = RECIPES.find(r => r.id === id);
                  const info = getSaleInfo(recipe, selectedCustomer);
                  const matchText = getMatchText(info);
                  
                  return (
                    <button
                      key={id}
                      onClick={() => info && info.canAfford && serveCustomer(selectedCustomer.id, id)}
                      disabled={!info || !info.canAfford}
                      className={`p-4 border-2 rounded-lg text-left transition-all min-h-[80px] ${getMatchClass(info)} ${
                        info && info.canAfford 
                          ? 'hover:shadow-md active:scale-98' 
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{recipe.name}</div>
                          <div className="text-sm text-gray-600">
                            Stock: {count} • Price: {recipe.sellPrice}g
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {info ? `${info.payment}g` : '—'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium match-indicator">
                        {matchText}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-600">No {selectedCustomer.requestType}s in stock</p>
                <p className="text-sm text-gray-500 mt-1">Craft some items first!</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-gray-600">Select a customer to see their preferences</p>
          </div>
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
