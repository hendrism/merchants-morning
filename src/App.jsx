import React, { useState, useEffect } from 'react';
import { Package, Coins, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PHASES, MATERIALS, BOX_TYPES } from './constants';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import CraftingPanel from './features/CraftingPanel';
import ShopInterface from './features/ShopInterface';
import EndOfDaySummary from './features/EndOfDaySummary';

const MerchantsMorning = () => {
  const [gameState, setGameState] = useState({
    phase: PHASES.MORNING,
    day: 1,
    gold: 120,
    materials: {
      iron: 3,
      wood: 3,
      fur: 2,
      cloth: 2,
      stone: 2,
      bone: 1
    },
    inventory: {},
    customers: [],
    totalEarnings: 0,
    shopLevel: 1
  });

  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEventLog, setShowEventLog] = useState(false);
  const [craftingTab, setCraftingTab] = useState('weapon');
  const [inventoryTab, setInventoryTab] = useState('weapon');
  const [sellingTab, setSellingTab] = useState('weapon');

  useEffect(() => {
    if (selectedCustomer) {
      setSellingTab(selectedCustomer.requestType);
    }
  }, [selectedCustomer]);

  const addEvent = (message, type = 'info') => {
    const event = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLog(prev => [event, ...prev.slice(0, 9)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'uncommon': return 'text-green-600 bg-green-100 border-green-200';
      case 'rare': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'common':
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const {
    openBox,
    craftItem,
    canCraft,
    filterRecipesByType,
    filterInventoryByType,
    sortRecipesByRarityAndCraftability,
    sortByMatchQualityAndRarity,
    getTopMaterials,
  } = useCrafting(gameState, setGameState, addEvent, addNotification);

  const { openShop, serveCustomer, endDay, startNewDay } =
    useCustomers(gameState, setGameState, addEvent, addNotification, setSelectedCustomer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-16">
      <Notifications notifications={notifications} />
      <div className="max-w-6xl mx-auto p-3">
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-amber-800">🏰 Merchant's Morning</h1>
            <p className="text-xs text-amber-600">Day {gameState.day} • {gameState.phase.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
              <Coins className="w-4 h-4" />
              {gameState.gold}
            </div>
            <button
              onClick={() => setShowEventLog(!showEventLog)}
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              <AlertCircle className="w-3 h-3" />
              Events {showEventLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {showEventLog && (
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3">
            <EventLog events={eventLog} />
          </div>
        )}

        {gameState.phase === PHASES.MORNING && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Supply Boxes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {Object.entries(BOX_TYPES).map(([type, box]) => (
                  <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50">
                    <h3 className="font-bold capitalize text-sm mb-1">{box.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {box.materialCount[0]}-{box.materialCount[1]} materials
                    </p>
                    <button
                      onClick={() => openBox(type)}
                      disabled={gameState.gold < box.cost}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-bold text-sm"
                    >
                      {box.cost} Gold
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }))}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                Continue to Crafting <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-bold mb-3">Materials</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(gameState.materials).filter(([_, count]) => count > 0).map(([materialId, count]) => {
                  const material = MATERIALS[materialId];
                  return (
                    <div key={materialId} className={`p-2 rounded text-xs ${getRarityColor(material.rarity)}`}>
                      <span className="mr-1">{material.icon}</span>
                      {material.name}: {count}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameState.phase === PHASES.CRAFTING && (
          <CraftingPanel
            gameState={gameState}
            craftingTab={craftingTab}
            setCraftingTab={setCraftingTab}
            inventoryTab={inventoryTab}
            setInventoryTab={setInventoryTab}
            canCraft={canCraft}
            craftItem={craftItem}
            filterRecipesByType={filterRecipesByType}
            sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
            filterInventoryByType={filterInventoryByType}
            openShop={openShop}
            getRarityColor={getRarityColor}
          />
        )}

        {gameState.phase === PHASES.SHOPPING && (
          <ShopInterface
            gameState={gameState}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            sellingTab={sellingTab}
            setSellingTab={setSellingTab}
            filterInventoryByType={filterInventoryByType}
            sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
            serveCustomer={serveCustomer}
            endDay={endDay}
            getRarityColor={getRarityColor}
          />
        )}

        {gameState.phase === PHASES.END_DAY && (
          <EndOfDaySummary gameState={gameState} startNewDay={startNewDay} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-yellow-600">
              <Coins className="w-4 h-4" />
              {gameState.gold}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {getTopMaterials().map(([materialId, count]) => {
                const material = MATERIALS[materialId];
                return (
                  <div key={materialId} className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <span>{material.icon}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-gray-500">
              Day {gameState.day}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantsMorning;
