import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Store } from 'lucide-react';
import TabButton from '../components/TabButton';
import { ITEM_TYPES, RECIPES, PROFESSIONS, ITEM_TYPE_ICONS } from '../constants';
import NegotiationPanel from '../components/NegotiationPanel';

const PROFESSION_STYLES = {
  knight: { icon: '🛡️', color: 'bg-gray-100 border-gray-400 text-gray-800' },
  ranger: { icon: '🏹', color: 'bg-green-100 border-green-400 text-green-800' },
  mage: { icon: '🧙', color: 'bg-purple-100 border-purple-400 text-purple-800' },
  merchant: { icon: '💼', color: 'bg-yellow-100 border-yellow-400 text-yellow-800' },
  noble: { icon: '👑', color: 'bg-pink-100 border-pink-400 text-pink-800' },
  guard: { icon: '🛡️', color: 'bg-blue-100 border-blue-400 text-blue-800' },
};

const BUDGET_INDICATORS = {
  wealthy: { text: '💰💰💰', color: 'bg-green-600' },
  middle: { text: '💰💰', color: 'bg-yellow-600' },
  budget: { text: '💰', color: 'bg-red-600' }
};

const ShopInterface = ({
  gameState,
  selectedCustomer,
  setSelectedCustomer,
  sellingTab,
  setSellingTab,
  filterInventoryByType,
  sortByMatchQualityAndRarity,
  serveCustomer,
  getRarityColor,
  getSaleInfo,
}) => {
  const [negotiatingItem, setNegotiatingItem] = useState(null);

  const sortedInventory = useMemo(
    () => sortByMatchQualityAndRarity(filterInventoryByType(sellingTab), selectedCustomer),
    [
      sellingTab,
      selectedCustomer,
      gameState.inventory,
      filterInventoryByType,
      sortByMatchQualityAndRarity,
    ]
  );

  const waitingCustomers = gameState.customers.filter(c => !c.satisfied);

  return (
    <div className="space-y-4">
      {/* Customer Selection - Chip Style */}
      <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Store className="w-4 h-4" />
          Select Customer ({waitingCustomers.length} waiting)
        </h2>

        {waitingCustomers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm text-gray-500 italic dark:text-gray-400">
              No customers waiting
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose a customer to serve:</p>
            
            {/* Customer Selection Chips */}
            <div className="flex flex-wrap gap-2">
              {waitingCustomers.map(customer => {
                const profStyle = PROFESSION_STYLES[customer.profession] || PROFESSION_STYLES.guard;
                const budgetInfo = BUDGET_INDICATORS[customer.budgetTier] || BUDGET_INDICATORS.budget;
                const isSelected = selectedCustomer?.id === customer.id;
                
                return (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setSellingTab(customer.requestType);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
                        : `hover:bg-gray-50 dark:hover:bg-gray-700 ${profStyle.color} dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`
                    }`}
                  >
                    <span className="text-lg">{profStyle.icon}</span>
                    <span className="text-sm font-medium">{customer.name.split(' ')[0]}</span>
                    <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full dark:bg-gray-200 dark:text-gray-800">
                      {ITEM_TYPE_ICONS[customer.requestType]}
                    </span>
                    <span className={`text-xs text-white px-1 py-1 rounded-full ${budgetInfo.color}`}>
                      {budgetInfo.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Customer Details */}
        {selectedCustomer && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PROFESSION_STYLES[selectedCustomer.profession]?.icon || '🙂'}</span>
                <div>
                  <div className="font-bold text-blue-800 dark:text-blue-200">{selectedCustomer.name}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Wants: <strong>{selectedCustomer.requestRarity} {selectedCustomer.requestType}</strong> • 
                    Budget: <strong>{selectedCustomer.maxBudget}g</strong>
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Prefers: {
                      Object.values(PROFESSIONS[selectedCustomer.profession]?.preferences || {})
                        .filter(p => p.length)
                        .map(p => p.join('/'))
                        .join(', ') || 'varied items'
                    }
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-blue-600 hover:text-blue-700 text-sm dark:text-blue-400 dark:hover:text-blue-300"
              >
                ✕ Deselect
              </button>
            </div>
          </div>
        )}

        {/* Served Customers Summary */}
        {gameState.customers.filter(c => c.satisfied).length > 0 && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border-green-200 border dark:bg-green-900 dark:border-green-700">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ <strong>Served Today:</strong> {gameState.customers.filter(c => c.satisfied).map(c => `${c.name} (${c.payment}g)`).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Items for Sale */}
      <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
        <h3 className="text-lg font-bold mb-3">Your Items for Sale</h3>

        {!selectedCustomer && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a customer above to see item pricing and sell items
            </p>
          </div>
        )}

        {selectedCustomer && (
          <>
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              {ITEM_TYPES.map(type => {
                const count = filterInventoryByType(type).length;
                return (
                  <TabButton
                    key={type}
                    active={sellingTab === type}
                    onClick={() => setSellingTab(type)}
                    count={count}
                    aria-label={type.charAt(0).toUpperCase() + type.slice(1)}
                  >
                    {ITEM_TYPE_ICONS[type]}
                  </TabButton>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {sortedInventory.map(([itemId, count]) => {
                const recipe = RECIPES.find(r => r.id === itemId);

                let saleInfo = null;
                let cardStyle = 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-700';

                if (selectedCustomer) {
                  saleInfo = getSaleInfo(recipe, selectedCustomer);

                  if (!saleInfo.canAfford) {
                    cardStyle = 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900';
                  } else if (saleInfo.isPreferred) {
                    cardStyle = 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900';
                  } else if (saleInfo.exactMatch) {
                    cardStyle = 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900';
                  } else if (saleInfo.status === 'upgrade') {
                    cardStyle = 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900';
                  } else if (
                    saleInfo.status === 'downgrade' ||
                    saleInfo.status === 'wrong_rarity' ||
                    saleInfo.status === 'over_budget' ||
                    saleInfo.status === 'wrong_type'
                  ) {
                    cardStyle = 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900';
                  } else {
                    cardStyle = 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900';
                  }
                }

                return (
                  <div key={itemId} className={`border rounded-lg p-3 ${cardStyle}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{recipe.name}</h4>
                        <p className={`text-xs px-2 py-1 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                          {recipe.type} • {recipe.rarity}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Stock: {count}</p>
                      </div>
                    </div>

                    {selectedCustomer && saleInfo && (
                      <div className="mb-2">
                        <p className="text-xs font-bold">
                          {saleInfo.isPreferred && (
                            <span className="text-purple-600 mr-1 dark:text-purple-400">★ Preferred style</span>
                          )}
                          {saleInfo.exactMatch ? (
                            <span className="text-green-600 dark:text-green-400">✓ Perfect Match!</span>
                          ) : saleInfo.status === 'upgrade' ? (
                            <span className="text-blue-600 dark:text-blue-400">⬆️ Upgrade!</span>
                          ) : saleInfo.status === 'downgrade' ? (
                            <span className="text-yellow-600 dark:text-yellow-400">⬇️ Downgrade</span>
                          ) : saleInfo.status === 'wrong_type' ? (
                            <span className="text-red-600 dark:text-red-400">❌ Wrong item type</span>
                          ) : saleInfo.status === 'cant_afford' ? (
                            <span className="text-red-600 dark:text-red-400">❌ Too expensive</span>
                          ) : saleInfo.status === 'over_budget' ? (
                            <span className="text-yellow-600 dark:text-yellow-400">💰 Max budget</span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">≈ Wrong rarity</span>
                          )}
                        </p>
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">{saleInfo.payment}g</p>
                      </div>
                    )}

                    {selectedCustomer && saleInfo && saleInfo.status === 'cant_afford' ? (
                      negotiatingItem === itemId ? (
                        <NegotiationPanel
                          customer={selectedCustomer}
                          item={recipe}
                          onAccept={() => {
                            serveCustomer(selectedCustomer.id, itemId, 'barter');
                            setNegotiatingItem(null);
                          }}
                          onDecline={() => setNegotiatingItem(null)}
                          onBack={() => setNegotiatingItem(null)}
                        />
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-red-600 dark:text-red-400">
                            Need {saleInfo.payment - selectedCustomer.maxBudget}g more
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => serveCustomer(selectedCustomer.id, itemId, 'accept_lower')}
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Accept {selectedCustomer.maxBudget}g
                            </button>
                            <button
                              onClick={() => setNegotiatingItem(itemId)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Trade
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => selectedCustomer && serveCustomer(selectedCustomer.id, itemId)}
                        disabled={!selectedCustomer}
                        className={`w-full py-2 rounded text-xs font-bold transition-colors ${
                          selectedCustomer
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {selectedCustomer ? `Sell to ${selectedCustomer.name.split(' ')[0]}` : 'Select Customer First'}
                      </button>
                    )}
                  </div>
                );
              })}

              {sortedInventory.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 italic dark:text-gray-400">No {sellingTab}s in stock</p>
                  <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">Craft some items to sell!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ShopInterface.propTypes = {
  gameState: PropTypes.shape({
    customers: PropTypes.array.isRequired,
    inventory: PropTypes.object.isRequired,
  }).isRequired,
  selectedCustomer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    profession: PropTypes.string.isRequired,
    requestType: PropTypes.string.isRequired,
    requestRarity: PropTypes.string.isRequired,
    offerPrice: PropTypes.number.isRequired,
    budgetTier: PropTypes.string.isRequired,
    maxBudget: PropTypes.number.isRequired,
    satisfied: PropTypes.bool,
    payment: PropTypes.number,
    materials: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string.isRequired, value: PropTypes.number.isRequired })
    ),
  }),
  setSelectedCustomer: PropTypes.func.isRequired,
  sellingTab: PropTypes.string.isRequired,
  setSellingTab: PropTypes.func.isRequired,
  filterInventoryByType: PropTypes.func.isRequired,
  sortByMatchQualityAndRarity: PropTypes.func.isRequired,
  serveCustomer: PropTypes.func.isRequired,
  getRarityColor: PropTypes.func.isRequired,
  getSaleInfo: PropTypes.func.isRequired,
};

export default ShopInterface;
