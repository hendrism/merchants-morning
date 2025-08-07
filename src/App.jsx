import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Coins, AlertCircle, Sun, Moon, Menu, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { PHASES, MATERIALS, BOX_TYPES, RECIPES } from './constants';
import { Card, CardHeader, CardContent } from './components/Card';
import useCardIntelligence from './hooks/useCardIntelligence';
import Workshop from './features/Workshop';
import InventoryPanel from './features/InventoryPanel';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import Button from './components/Button';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import useGameState from './hooks/useGameState';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const notificationTimers = useRef([]);

  // NEW: Replace all individual card state with smart management
  const cardIntelligence = useCardIntelligence(gameState, {
    // Load user preferences from localStorage
    preferredExpansions: (() => {
      try {
        const stored = window.localStorage.getItem('userCardPreferences');
        return stored ? JSON.parse(stored).preferredExpansions : {};
      } catch {
        return {};
      }
    })(),
    preferredCollapsed: (() => {
      try {
        const stored = window.localStorage.getItem('userCardPreferences');
        return stored ? JSON.parse(stored).preferredCollapsed : {};
      } catch {
        return {};
      }
    })()
  });

  const {
    getCardState,
    updateCardState,
    trackCardUsage,
    getCardStatus
  } = cardIntelligence;

  // Helper function to handle card toggles
  const handleCardToggle = useCallback((cardId) => {
    const currentState = getCardState(cardId);
    const newExpanded = !currentState.expanded;
    updateCardState(cardId, { expanded: newExpanded });
    trackCardUsage(cardId, newExpanded ? 'expand' : 'collapse');

    // Save preferences
    try {
      const prefs = JSON.parse(window.localStorage.getItem('userCardPreferences') || '{}');
      if (!prefs.preferredExpansions) prefs.preferredExpansions = {};
      if (!prefs.preferredCollapsed) prefs.preferredCollapsed = {};

      if (newExpanded) {
        if (!prefs.preferredExpansions[gameState.phase]) {
          prefs.preferredExpansions[gameState.phase] = [];
        }
        if (!prefs.preferredExpansions[gameState.phase].includes(cardId)) {
          prefs.preferredExpansions[gameState.phase].push(cardId);
        }
      }

      window.localStorage.setItem('userCardPreferences', JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save card preferences', e);
    }
  }, [getCardState, updateCardState, trackCardUsage, gameState.phase]);

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
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
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
    getSaleInfo,
  } = useCrafting(gameState, setGameState, addEvent, addNotification);

  const materialsByType = useMemo(
    () =>
      Object.entries(gameState.materials)
        .filter(([, count]) => count > 0)
        .reduce((acc, [id, count]) => {
          const material = MATERIALS[id];
          const type = material.type || 'other';
          if (!acc[type]) acc[type] = [];
          acc[type].push({ id, count, material });
          return acc;
        }, {}),
    [gameState.materials]
  );

  const filterInventoryByType = useCallback(
    (type) => rawFilterInventoryByType(type),
    [gameState.inventory]
  );

  const { openShop, serveCustomer, endDay, startNewDay } =
    useCustomers(gameState, setGameState, addEvent, addNotification, setSelectedCustomer);

  const totalMaterials = Object.values(gameState.materials).reduce((sum, c) => sum + c, 0);
  const topMaterialPreview = Object.entries(gameState.materials)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, count]) => `${MATERIALS[id].icon}${count}`)
    .join(' ');

  const totalInventoryItems = Object.values(gameState.inventory).reduce(
    (sum, c) => sum + c,
    0
  );

  const waitingCustomers = gameState.customers.filter(c => !c.satisfied).length;
  const totalRecipes = RECIPES.length;
  const craftableRecipes = RECIPES.filter(canCraft).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-20 pb-safe dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <Notifications notifications={notifications} />
      <div className="max-w-6xl mx-auto p-3">
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300">🏰 Merchant's Morning</h1>
              <p className="text-sm sm:text-xs text-amber-600 dark:text-amber-400">Day {gameState.day} • {gameState.phase.replace('_', ' ').toUpperCase()}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-12 h-12 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg dark:bg-gray-700 dark:border-gray-600 z-50">
                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <button
                    onClick={() => {
                      setShowEventLog(!showEventLog);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <BookOpen className="w-4 h-4" />
                    {showEventLog ? 'Hide Events' : 'Show Events'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset game progress?')) {
                        resetGame();
                        addEvent('Game reset', 'info');
                        addNotification('Game reset', 'success');
                      }
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Reset Game
                  </button>
                  <button disabled className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button disabled className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                    <HelpCircle className="w-4 h-4" />
                    Help / About
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-yellow-600">
            <Coins className="w-5 h-5" />
            {gameState.gold}
          </div>
        </div>

        {showEventLog && (
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800">
            <EventLog events={eventLog} />
          </div>
        )}
        {[PHASES.MORNING, PHASES.CRAFTING].includes(gameState.phase) && (
          <Card>
            <CardHeader
              icon="📈"
              title="Market News"
              subtitle={getCardStatus('marketNews', gameState).subtitle}
              subtitleClassName={getCardStatus('marketNews', gameState).status === 'locked' ? 'text-red-600' : ''}
              expanded={getCardState('marketNews').expanded}
              onToggle={() => handleCardToggle('marketNews')}
              isEmpty={gameState.marketReports.length === 0}
            />
            {getCardState('marketNews').expanded && (
              <CardContent>
                {gameState.marketReports.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {gameState.marketReports.map((report, idx) => (
                      <li key={idx}>{report}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    The market is quiet today.
                  </p>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {gameState.phase === PHASES.MORNING && (
          <>
            <Card>
              <CardHeader
                icon="🛍️"
                title="Supply Boxes"
                subtitle={getCardStatus('supplyBoxes', gameState).subtitle}
                subtitleClassName={getCardStatus('supplyBoxes', gameState).status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('supplyBoxes').expanded}
                onToggle={() => handleCardToggle('supplyBoxes')}
              />
              {getCardState('supplyBoxes').expanded && (
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.entries(BOX_TYPES).map(([type, box]) => (
                      <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h3 className="font-bold capitalize text-sm mb-1">{box.name}</h3>
                        <p className="text-sm sm:text-xs text-gray-600 mb-2 dark:text-gray-300">
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
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader
                icon="🧰"
                title="Materials"
                subtitle={getCardStatus('materials', gameState).subtitle}
                subtitleClassName={getCardStatus('materials', gameState).status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('materials').expanded}
                onToggle={() => handleCardToggle('materials')}
                isEmpty={totalMaterials === 0}
              />
              {getCardState('materials').expanded && (
                <CardContent>
                  {Object.keys(materialsByType).length > 0 ? (
                    Object.entries(materialsByType).map(([type, mats]) => (
                      <div key={type} className="mb-2">
                        <h4 className="font-semibold text-sm mb-1 capitalize">{type}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mats.map(({ id, count, material }) => (
                            <div key={id} className={`p-2 rounded text-sm sm:text-xs ${getRarityColor(material.rarity)}`}>
                              <span className="mr-1">{material.icon}</span>
                              {material.name}: {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">No materials</p>
                  )}
                </CardContent>
              )}
            </Card>
          </>
        )}

        {[PHASES.MORNING, PHASES.CRAFTING].includes(gameState.phase) && (
          <Card>
            <CardHeader
              icon="🔨"
              title="Workshop"
              subtitle={getCardStatus('workshop', { ...gameState, craftableCount: craftableRecipes, totalRecipeCount: totalRecipes }).subtitle}
              subtitleClassName={getCardStatus('workshop', { ...gameState, craftableCount: craftableRecipes, totalRecipeCount: totalRecipes }).status === 'locked' ? 'text-red-600' : ''}
              expanded={getCardState('workshop').expanded}
              onToggle={() => handleCardToggle('workshop')}
            />
            {getCardState('workshop').expanded && (
              <CardContent>
                <Workshop
                  gameState={gameState}
                  craftingTab={craftingTab}
                  setCraftingTab={setCraftingTab}
                  canCraft={canCraft}
                  craftItem={craftItem}
                  filterRecipesByType={filterRecipesByType}
                  sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
                  getRarityColor={getRarityColor}
                />
              </CardContent>
            )}
          </Card>
        )}

        {gameState.phase === PHASES.CRAFTING && (
          <Card>
            <CardHeader
              icon="📦"
              title="Inventory"
              subtitle={getCardStatus('inventory', gameState).subtitle}
              subtitleClassName={getCardStatus('inventory', gameState).status === 'locked' ? 'text-red-600' : ''}
              expanded={getCardState('inventory').expanded}
              onToggle={() => handleCardToggle('inventory')}
              isEmpty={totalInventoryItems === 0}
            />
            {getCardState('inventory').expanded && (
              <CardContent>
                <InventoryPanel
                  gameState={gameState}
                  inventoryTab={inventoryTab}
                  setInventoryTab={setInventoryTab}
                  filterInventoryByType={filterInventoryByType}
                  getRarityColor={getRarityColor}
                />
              </CardContent>
            )}
          </Card>
        )}

        {gameState.phase === PHASES.SHOPPING && (
          <Card>
            <CardHeader
              icon="👥"
              title="Customers"
              subtitle={getCardStatus('customerQueue', gameState).subtitle}
              subtitleClassName={getCardStatus('customerQueue', gameState).status === 'locked' ? 'text-red-600' : ''}
              expanded={getCardState('customerQueue').expanded}
              onToggle={() => handleCardToggle('customerQueue')}
              isEmpty={waitingCustomers === 0}
            />
            {getCardState('customerQueue').expanded && (
              <CardContent>
                <ShopInterface
                  gameState={gameState}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  sellingTab={sellingTab}
                  setSellingTab={setSellingTab}
                  filterInventoryByType={filterInventoryByType}
                  sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
                  serveCustomer={serveCustomer}
                  getRarityColor={getRarityColor}
                  getSaleInfo={getSaleInfo}
                />
              </CardContent>
            )}
          </Card>
        )}

        {gameState.phase === PHASES.END_DAY && (
          <EndOfDaySummary gameState={gameState} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg pb-safe dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center h-[70px]">
          <div className="flex items-center gap-3 overflow-x-auto flex-[7] px-4">
            {getTopMaterials().map(([materialId, count]) => {
              const material = MATERIALS[materialId];
              return (
                <div key={materialId} className="flex items-center gap-1 text-lg whitespace-nowrap">
                  <span>{material.icon}</span>
                  <span className="font-medium">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="flex-[3] px-4 border-l border-gray-400/30 dark:border-white/20 flex items-center">
            {gameState.phase === PHASES.MORNING && (
              <Button
                onClick={() => {
                  setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }));
                  addEvent('Crafting phase started', 'info');
                  addNotification('⚒️ Crafting phase started', 'info');
                }}
                className="w-full h-12 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 shadow"
              >
                START CRAFTING
              </Button>
            )}
            {gameState.phase === PHASES.CRAFTING && (
              <Button
                onClick={openShop}
                className="w-full h-12 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 shadow"
              >
                OPEN SHOP
              </Button>
            )}
            {gameState.phase === PHASES.SHOPPING && (
              <Button
                onClick={endDay}
                className="w-full h-12 rounded-lg font-bold text-white bg-purple-500 hover:bg-purple-600 shadow"
              >
                CLOSE SHOP
              </Button>
            )}
            {gameState.phase === PHASES.END_DAY && (
              <Button
                onClick={startNewDay}
                className="w-full h-12 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 shadow"
              >
                NEW DAY
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantsMorning;
