import React from 'react';
import { Store } from 'lucide-react';
import TabButton from '../components/TabButton';
import { ITEM_TYPES, RECIPES } from '../constants';

const ShopInterface = ({
  gameState,
  selectedCustomer,
  setSelectedCustomer,
  sellingTab,
  setSellingTab,
  filterInventoryByType,
  sortByMatchQualityAndRarity,
  serveCustomer,
  endDay,
  getRarityColor,
}) => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Store className="w-4 h-4" />
        Select Customer ({gameState.customers.filter(c => !c.satisfied).length} waiting)
      </h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {gameState.customers.filter(c => !c.satisfied).map(customer => (
          <button
            key={customer.id}
            onClick={() => {
              setSelectedCustomer(customer);
              setSellingTab(customer.requestType);
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCustomer?.id === customer.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="font-bold">
              {customer.name}
              {customer.isFlexible && <span className="ml-1">😊</span>}
            </div>
            <div className="text-xs opacity-80">
              {customer.requestRarity} {customer.requestType} • {customer.offerPrice}g
            </div>
          </button>
        ))}
      </div>

      {gameState.customers.filter(c => c.satisfied).length > 0 && (
        <div className="mt-3 p-2 bg-green-50 rounded border-green-200 border dark:bg-green-900 dark:border-green-700">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✅ Served: {gameState.customers.filter(c => c.satisfied).map(c => `${c.name} (${c.payment}g)`).join(', ')}
          </p>
        </div>
      )}

      <button
        onClick={endDay}
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-bold"
      >
        Close Shop for Today
      </button>
    </div>

    {selectedCustomer && (
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
        <p className="font-medium text-blue-800 dark:text-blue-300">
          Selling to: {selectedCustomer.name} (wants {selectedCustomer.requestRarity} {selectedCustomer.requestType} • offers {selectedCustomer.offerPrice}g)
          {selectedCustomer.isFlexible && <span className="text-blue-600"> • Flexible with substitutes 😊</span>}
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

      <div className="flex gap-1 mb-3">
        {ITEM_TYPES.map(type => {
          const count = filterInventoryByType(type).length;
          return (
            <TabButton
              key={type}
              active={sellingTab === type}
              onClick={() => setSellingTab(type)}
              count={count}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabButton>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {sortByMatchQualityAndRarity(filterInventoryByType(sellingTab), selectedCustomer).map(([itemId, count]) => {
          const recipe = RECIPES.find(r => r.id === itemId);

          let saleInfo = null;
          let cardStyle = 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-700';

          if (selectedCustomer) {
            const exactMatch = recipe.type === selectedCustomer.requestType && recipe.rarity === selectedCustomer.requestRarity;
            let payment = selectedCustomer.offerPrice;
            let status = 'perfect';

            if (!exactMatch) {
              let penalty = selectedCustomer.isFlexible ? 0.2 : 0.4;
              const rarityOrder = { common: 1, uncommon: 2, rare: 3 };
              if (rarityOrder[recipe.rarity] > rarityOrder[selectedCustomer.requestRarity]) {
                penalty -= 0.1;
                status = 'upgrade';
              } else if (recipe.type === selectedCustomer.requestType) {
                status = 'wrong_rarity';
              } else {
                status = 'substitute';
              }
              payment = Math.floor(payment * (1 - penalty));
            }

            saleInfo = { payment, status, exactMatch };

            if (saleInfo.exactMatch) {
              cardStyle = 'border-green-300 bg-green-50';
            } else if (saleInfo.status === 'upgrade') {
              cardStyle = 'border-blue-300 bg-blue-50';
            } else if (saleInfo.status === 'wrong_rarity' || (saleInfo.status === 'substitute' && selectedCustomer.isFlexible)) {
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
                  <p className={`text-xs px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                    {recipe.type} • {recipe.rarity}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Stock: {count}</p>
                </div>
              </div>

              {selectedCustomer && saleInfo && (
                <div className="mb-2">
                  <p className="text-xs font-bold">
                    {saleInfo.exactMatch ? (
                      <span className="text-green-600">✓ Perfect Match!</span>
                    ) : saleInfo.status === 'upgrade' ? (
                      <span className="text-blue-600">⬆️ Upgrade!</span>
                    ) : saleInfo.status === 'wrong_rarity' ? (
                      <span className="text-yellow-600">≈ Wrong rarity</span>
                    ) : selectedCustomer.isFlexible ? (
                      <span className="text-yellow-600">~ Acceptable substitute</span>
                    ) : (
                      <span className="text-red-600">~ Poor substitute</span>
                    )}
                  </p>
                  <p className="text-sm font-bold text-green-600">{saleInfo.payment}g</p>
                </div>
              )}

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
            </div>
          );
        })}

        {filterInventoryByType(sellingTab).length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 italic dark:text-gray-400">No {sellingTab}s in stock</p>
            <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">Craft some items to sell!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ShopInterface;
