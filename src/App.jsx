import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Package, Coins, ChevronRight, AlertCircle, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { PHASES, MATERIALS, BOX_TYPES } from './constants';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import useGameState from './hooks/useGameState';
import CraftingPanel from './features/CraftingPanel';
import ShopInterface from './features/ShopInterface';
import EndOfDaySummary from './features/EndOfDaySummary';

const MerchantsMorning = () => {
  const [gameState, setGameState, resetGame] = useGameState();

  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEventLog, setShowEventLog] = useState(false);
  const [craftingTab, setCraftingTab] = useState('weapon');
  const [inventoryTab, setInventoryTab] = useState('weapon');
  const [sellingTab, setSellingTab] = useState('weapon');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem('darkMode');
      return stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      console.error('Failed to load dark mode preference', e);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });
  const notificationTimers = useRef([]);

  useEffect(() => {
    if (selectedCustomer) {
      setSellingTab(selectedCustomer.requestType);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('darkMode', darkMode);
      } catch (e) {
        console.error('Failed to save dark mode preference', e);
      }
    }
  }, [darkMode]);

  useEffect(() => {
    return () => {
      notificationTimers.current.forEach(clearTimeout);
    };
  }, []);

  const addEvent = (message, type = 'info') => {
    const event = {
        id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLog(prev => [event, ...prev.slice(0, 9)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = {
        id: crypto.randomUUID(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      notificationTimers.current = notificationTimers.current.filter(t => t !== timer);
    }, 3000);
    notificationTimers.current.push(timer);
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
    filterInventoryByType: rawFilterInventoryByType,
    sortRecipesByRarityAndCraftability,
    sortByMatchQualityAndRarity,
    getTopMaterials,
  } = useCrafting(gameState, setGameState, addEvent, addNotification);

  const filterInventoryByType = useCallback(
    (type) => rawFilterInventoryByType(type),
    [gameState.inventory]
  );

  const { openShop, serveCustomer, endDay, startNewDay } =
    useCustomers(gameState, setGameState, addEvent, addNotification, setSelectedCustomer);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-16 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <Notifications notifications={notifications} />
      <div className="max-w-6xl mx-auto p-3">
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 flex items-center justify-between dark:bg-gray-800">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300">🏰 Merchant's Morning</h1>
            <p className="text-xs text-amber-600 dark:text-amber-400">Day {gameState.day} • {gameState.phase.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
              <Coins className="w-4 h-4" />
              {gameState.gold}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowEventLog(!showEventLog)}
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <AlertCircle className="w-3 h-3" />
              Events {showEventLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset game progress?')) {
                  resetGame();
                  addEvent('Game reset', 'info');
                  addNotification('Game reset', 'success');
                }
              }}
              className="flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded dark:bg-red-700 dark:hover:bg-red-600"
            >
              Reset Game
            </button>
          </div>
        </div>

        {showEventLog && (
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800">
            <EventLog events={eventLog} />
          </div>
        )}

        {gameState.phase === PHASES.MORNING && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Supply Boxes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {Object.entries(BOX_TYPES).map(([type, box]) => (
                  <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h3 className="font-bold capitalize text-sm mb-1">{box.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 dark:text-gray-300">
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

            <div className="bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2 dark:bg-gray-800 dark:border-gray-700">
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
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Day {gameState.day}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantsMorning;
