import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Store } from 'lucide-react';
import TabButton from '../components/TabButton';
import { ITEM_TYPES, RECIPES, PROFESSIONS, ITEM_TYPE_ICONS } from '../constants';
import NegotiationPanel from '../components/NegotiationPanel';

const PROFESSION_STYLES = {
  knight: { icon: '🛡️', border: 'border-gray-400' },
  ranger: { icon: '🏹', border: 'border-green-400' },
  mage: { icon: '🧙', border: 'border-purple-400' },
  merchant: { icon: '💼', border: 'border-yellow-400' },
  noble: { icon: '👑', border: 'border-pink-400' },
  guard: { icon: '🛡️', border: 'border-blue-400' },
};

const RARITY_GEMS = { common: '⚪', uncommon: '🟢', rare: '💎', legendary: '🟡' };
const BUDGET_HEIGHT = { wealthy: '100%', middle: '60%', budget: '30%' };

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

  return (
  <div className="space-y-4">
    <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Store className="w-4 h-4" />
        Select Customer ({gameState.customers.filter(c => !c.satisfied).length} waiting)
      </h2>

      <div className="sm:hidden mb-3">
        <select
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = gameState.customers.find(c => String(c.id) === e.target.value);
            if (customer) {
              setSelectedCustomer(customer);
              setSellingTab(customer.requestType);
            }
          }}
          className="w-full p-2 rounded-lg border bg-white dark:bg-gray-700 dark:text-gray-200 min-h-[44px]"
        >
          <option value="">Select a customer</option>
          {gameState.customers.filter(c => !c.satisfied).map(c => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.requestRarity} {c.requestType} ({c.maxBudget}g)
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:flex gap-4 overflow-x-auto pb-2">
        {gameState.customers.filter(c => !c.satisfied).map(customer => {
          const prof = PROFESSION_STYLES[customer.profession] || {};
          return (
            <button
              key={customer.id}
              onClick={() => {
                setSelectedCustomer(customer);
                setSellingTab(customer.requestType);
              }}
              className={`relative p-2 rounded-lg flex flex-col items-center min-h-[64px] min-w-[64px] transition-colors ${
                selectedCustomer?.id === customer.id
                  ? 'ring-2 ring-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
              } ${prof.border || ''}`}
            >
              <div className="relative mb-1">
                <span className="text-3xl" aria-hidden="true">{prof.icon || '🙂'}</span>
                <div className="absolute -top-1 -right-1 bg-white border rounded px-1 text-xs">
                  {ITEM_TYPE_ICONS[customer.requestType]} {RARITY_GEMS[customer.requestRarity]}
                </div>
              </div>
              <div className="w-2 h-10 bg-yellow-200 rounded overflow-hidden mb-1">
                <div
                  className="bg-yellow-500 w-full"
                  style={{ height: BUDGET_HEIGHT[customer.budgetTier] || '50%' }}
                />
              </div>
              <div className="text-xs text-center font-bold">
                {customer.name}
              </div>
            </button>
          );
        })}
      </div>

      {gameState.customers.filter(c => c.satisfied).length > 0 && (
        <div className="mt-3 p-2 bg-green-50 rounded border-green-200 border dark:bg-green-900 dark:border-green-700">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ Served: {gameState.customers.filter(c => c.satisfied).map(c => `${c.name} (${c.payment}g)`).join(', ')}
          </p>
        </div>
      )}
    </div>

    {selectedCustomer && (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
        <p className="font-medium text-blue-800 dark:text-blue-300">
          Selling to: {selectedCustomer.name} (wants {selectedCustomer.requestRarity} {selectedCustomer.requestType} • Budget: {selectedCustomer.maxBudget}g)
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Prefers: {
            Object.values(PROFESSIONS[selectedCustomer.profession].preferences)
              .filter(p => p.length)
              .map(p => p.join('/'))
              .join(', ') || 'varied items'
          }
        </p>
      </div>
    )}

    <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h3 className="text-lg font-bold mb-3">Your Items for Sale</h3>

      {!selectedCustomer && (
        <p className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded dark:text-gray-400 dark:bg-gray-700">
          👆 Select a customer above to see item pricing and sell items
        </p>
      )}

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
              cardStyle = 'border-red-200 bg-red-50';
            } else if (saleInfo.isPreferred) {
              cardStyle = 'border-purple-300 bg-purple-50';
            } else if (saleInfo.exactMatch) {
              cardStyle = 'border-green-300 bg-green-50';
            } else if (saleInfo.status === 'upgrade') {
              cardStyle = 'border-blue-300 bg-blue-50';
            } else if (
              saleInfo.status === 'downgrade' ||
              saleInfo.status === 'wrong_rarity' ||
              saleInfo.status === 'over_budget' ||
              saleInfo.status === 'wrong_type'
            ) {
              cardStyle = 'border-yellow-300 bg-yellow-50';
            } else {
              cardStyle = 'border-red-200 bg-red-50';
            }
          }

          return (
            <div key={itemId} className={`border rounded-lg p-3 ${cardStyle}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{recipe.name}</h4>
                  <p className={`text-sm sm:text-xs px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                    {recipe.type} • {recipe.rarity}
                  </p>
                  <p className="text-sm sm:text-xs text-gray-600 dark:text-gray-300">Stock: {count}</p>
                </div>
              </div>

              {selectedCustomer && saleInfo && (
                <div className="mb-2">
                  <p className="text-sm sm:text-xs font-bold">
                    {saleInfo.isPreferred && (
                      <span className="text-purple-600 mr-1">★ Preferred style</span>
                    )}
                    {saleInfo.exactMatch ? (
                      <span className="text-green-600">✓ Perfect Match!</span>
                    ) : saleInfo.status === 'upgrade' ? (
                      <span className="text-blue-600">⬆️ Upgrade!</span>
                    ) : saleInfo.status === 'downgrade' ? (
                      <span className="text-yellow-600">⬇️ Downgrade</span>
                    ) : saleInfo.status === 'wrong_type' ? (
                      <span className="text-red-600">❌ Wrong item type</span>
                    ) : saleInfo.status === 'cant_afford' ? (
                      <span className="text-red-600">❌ Too expensive</span>
                    ) : saleInfo.status === 'over_budget' ? (
                      <span className="text-yellow-600">💰 Max budget</span>
                    ) : (
                      <span className="text-yellow-600">≈ Wrong rarity</span>
                    )}
                  </p>
                  <p className="text-sm font-bold text-green-600">{saleInfo.payment}g</p>
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
                    <p className="text-sm text-red-600">
                      Need {saleInfo.payment - selectedCustomer.maxBudget}g more
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => serveCustomer(selectedCustomer.id, itemId, 'accept_lower')}
                        className="flex-1 btn-primary"
                      >
                        Accept {selectedCustomer.maxBudget}g Only
                      </button>
                      <button
                        onClick={() => setNegotiatingItem(itemId)}
                        className="flex-1 btn-secondary"
                      >
                        Negotiate Trade
                      </button>
                      <button
                        onClick={() => setNegotiatingItem(null)}
                        className="flex-1 btn-danger"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <button
                  onClick={() => selectedCustomer && serveCustomer(selectedCustomer.id, itemId)}
                  disabled={!selectedCustomer}
                  className={`w-full py-2 rounded text-sm font-bold transition-colors ${
                    selectedCustomer
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedCustomer ? `Sell to ${selectedCustomer.name}` : 'Select Customer First'}
                </button>
              )}
            </div>
          );
        })}

        {sortedInventory.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 italic dark:text-gray-400">No {sellingTab}s in stock</p>
            <p className="text-sm sm:text-xs text-gray-400 mt-1 dark:text-gray-500">Craft some items to sell!</p>
          </div>
        )}
      </div>
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
