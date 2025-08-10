import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coins, AlertCircle, Sun, Moon, Menu, BookOpen, Settings, HelpCircle, ArrowRight } from 'lucide-react';
import { PHASES, BOX_TYPES, RECIPES } from './constants';
import { Card, CardHeader, CardContent } from './components/Card';
import Workshop from './features/Workshop';
import InventoryPanel from './features/InventoryPanel';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import Button from './components/Button';
import MaterialStallsPanel from './features/MaterialStallsPanel';
import GestureHandler from './components/GestureHandler';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import useGameState from './hooks/useGameState';
import ShopInterface from './features/ShopInterface';
import EndOfDaySummary from './features/EndOfDaySummary';
import useCardIntelligence from './hooks/useCardIntelligence';
import generateId from './utils/id';
import UpdateToast from './components/UpdateToast';

const MerchantsMorning = () => {
  const [gameState, setGameState, resetGame] = useGameState();

  const PHASE_ICONS = {
    [PHASES.MORNING]: '🌅',
    [PHASES.CRAFTING]: '🔨',
    [PHASES.SHOPPING]: '🏪',
    [PHASES.END_DAY]: '🌙',
  };

  const cardIntelligence = useCardIntelligence(gameState);

  const { getCardState, updateCardState, toggleCategory, getCardStatus } = cardIntelligence;

  // Helper function to handle card toggles for three states
  const handleCardToggle = useCallback((cardId) => {
    const current = getCardState(cardId);
    if (!current.semiExpanded && !current.expanded) {
      updateCardState(cardId, { semiExpanded: true });
    } else if (current.semiExpanded && !current.expanded) {
      updateCardState(cardId, { expanded: true });
    } else {
      updateCardState(cardId, { expanded: false, semiExpanded: false, expandedCategories: [] });
    }
  }, [getCardState, updateCardState]);

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
      id: generateId(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLog(prev => [event, ...prev.slice(0, 9)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = {
      id: generateId(),
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
    switch (rarity) {
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
      getSaleInfo,
    } = useCrafting(gameState, setGameState, addEvent, addNotification);

  const filterInventoryByType = useCallback(
    (type) => rawFilterInventoryByType(type),
    [gameState.inventory]
  );

  const { openShop, serveCustomer, endDay, startNewDay } =
    useCustomers(gameState, setGameState, addEvent, addNotification, setSelectedCustomer);

  const totalRecipes = RECIPES.length;
  const craftableRecipes = RECIPES.filter(canCraft).length;

  const marketNewsStatus = getCardStatus('marketNews', gameState);
  const supplyBoxesStatus = getCardStatus('supplyBoxes', gameState);
  const materialsStatus = getCardStatus('materials', gameState);
  const workshopStatus = getCardStatus('workshop', { ...gameState, craftableCount: craftableRecipes, totalRecipeCount: totalRecipes });
  const inventoryStatus = getCardStatus('inventory', gameState);
  const customerQueueStatus = getCardStatus('customerQueue', gameState);

  const advancePhase = useCallback(() => {
    switch (gameState.phase) {
      case PHASES.MORNING:
        setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }));
        addNotification('⚒️ Advanced to Crafting', 'info');
        break;
      case PHASES.CRAFTING:
        openShop();
        break;
      case PHASES.SHOPPING:
        endDay();
        break;
      case PHASES.END_DAY:
        startNewDay();
        break;
      default:
        break;
    }
  }, [gameState.phase, setGameState, addNotification, openShop, endDay, startNewDay]);

  // NEW: Gesture handlers
  const handleSwipeGesture = useCallback((direction) => {
    if (direction === 'left') {
      advancePhase();
    } else if (direction === 'right') {
      // Go to previous phase (limited)
      switch (gameState.phase) {
        case PHASES.CRAFTING:
          setGameState(prev => ({ ...prev, phase: PHASES.MORNING }));
          addNotification('🌅 Swiped back to Morning', 'info');
          break;
        case PHASES.SHOPPING:
          setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }));
          addNotification('⚒️ Swiped back to Crafting', 'info');
          break;
        default:
          break;
      }
    }
  }, [advancePhase, gameState.phase, setGameState, addNotification]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-20 pb-safe dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <Notifications notifications={notifications} />
      <GestureHandler
        onSwipe={handleSwipeGesture}
        className="max-w-6xl mx-auto p-3"
      >
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300">🏰 Merchant's Morning</h1>
              <p className="text-sm sm:text-xs text-amber-600 dark:text-amber-400">
                Day {gameState.day} • {PHASE_ICONS[gameState.phase]}{' '}
                {gameState.phase.charAt(0).toUpperCase() + gameState.phase.slice(1)}
              </p>
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
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800" data-card-id="eventLog">
            <EventLog events={eventLog} />
          </div>
        )}

        {!getCardState('marketNews').hidden && [PHASES.MORNING, PHASES.CRAFTING, PHASES.END_DAY].includes(gameState.phase) && (
          <div data-card-id="marketNews">
            <Card>
              <CardHeader
                icon="📈"
                title="Market News"
                subtitle={marketNewsStatus.subtitle}
                subtitleClassName={marketNewsStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('marketNews').expanded}
                semiExpanded={getCardState('marketNews').semiExpanded}
                onToggle={() => handleCardToggle('marketNews')}
                isEmpty={gameState.marketReports.length === 0}
                status={marketNewsStatus.status}
                badge={marketNewsStatus.badge}
              />
              {getCardState('marketNews').expanded && (
                <CardContent expanded={getCardState('marketNews').expanded}>
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
          </div>
        )}

        {[PHASES.MORNING, PHASES.END_DAY].includes(gameState.phase) && !getCardState('supplyBoxes').hidden && (
          <div data-card-id="supplyBoxes">
            <Card>
              <CardHeader
                icon="🛍️"
                title="Supply Boxes"
                subtitle={supplyBoxesStatus.subtitle}
                subtitleClassName={supplyBoxesStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('supplyBoxes').expanded}
                semiExpanded={getCardState('supplyBoxes').semiExpanded}
                onToggle={() => handleCardToggle('supplyBoxes')}
                status={supplyBoxesStatus.status}
                badge={supplyBoxesStatus.badge}
              />
              {getCardState('supplyBoxes').expanded && (
                <CardContent expanded={getCardState('supplyBoxes').expanded}>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(BOX_TYPES).map(([type, box]) => (
                      <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h3 className="font-bold capitalize text-sm mb-1 h-10 flex items-center justify-center">{box.name}</h3>
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
          </div>
        )}

        {!getCardState('materials').hidden && [PHASES.MORNING, PHASES.CRAFTING, PHASES.END_DAY].includes(gameState.phase) && (
          <div data-card-id="materials">
            <Card>
              <CardHeader
                icon="🏪"
                title="Material Storage"
                subtitle={materialsStatus.subtitle}
                subtitleClassName={materialsStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('materials').expanded}
                semiExpanded={getCardState('materials').semiExpanded}
                onToggle={() => handleCardToggle('materials')}
                isEmpty={materialsStatus.badge === 0}
                status={materialsStatus.status}
                badge={materialsStatus.badge}
              />
              {getCardState('materials').expanded && (
                <CardContent expanded={getCardState('materials').expanded}>
                  <MaterialStallsPanel
                    gameState={gameState}
                    getRarityColor={getRarityColor}
                  />
                </CardContent>
              )}
            </Card>
          </div>
        )}

        {!getCardState('workshop').hidden && [PHASES.CRAFTING, PHASES.END_DAY].includes(gameState.phase) && (
          <div data-card-id="workshop">
            <Card>
              <CardHeader
                icon="🔨"
                title="Workshop"
                expanded={getCardState('workshop').expanded}
                semiExpanded={getCardState('workshop').semiExpanded}
                onToggle={() => handleCardToggle('workshop')}
                status={workshopStatus.status}
                badge={workshopStatus.badge}
                progress={{ current: craftableRecipes, total: totalRecipes }}
                subtitle={workshopStatus.subtitle}
              />
              {getCardState('workshop').expanded && (
                <CardContent expanded={getCardState('workshop').expanded}>
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
          </div>
        )}

        {!getCardState('inventory').hidden && [PHASES.CRAFTING, PHASES.END_DAY].includes(gameState.phase) && (
          <div data-card-id="inventory">
            <Card>
              <CardHeader
                icon="📦"
                title="Inventory"
                subtitle={inventoryStatus.subtitle}
                subtitleClassName={inventoryStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('inventory').expanded}
                semiExpanded={getCardState('inventory').semiExpanded}
                onToggle={() => handleCardToggle('inventory')}
                isEmpty={inventoryStatus.badge === 0}
                status={inventoryStatus.status}
                badge={inventoryStatus.badge}
              />
              {getCardState('inventory').expanded && (
                <CardContent expanded={getCardState('inventory').expanded}>
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
          </div>
        )}

        {!getCardState('customerQueue').hidden && [PHASES.SHOPPING, PHASES.END_DAY].includes(gameState.phase) && (
          <div data-card-id="customerQueue">
            <Card>
              <CardHeader
                icon="👥"
                title="Customers"
                subtitle={customerQueueStatus.subtitle}
                subtitleClassName={customerQueueStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('customerQueue').expanded}
                semiExpanded={getCardState('customerQueue').semiExpanded}
                onToggle={() => handleCardToggle('customerQueue')}
                isEmpty={customerQueueStatus.badge === 0}
                status={customerQueueStatus.status}
                badge={customerQueueStatus.badge}
              />
              {getCardState('customerQueue').expanded && (
                <CardContent expanded={getCardState('customerQueue').expanded}>
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
          </div>
        )}

          {gameState.phase === PHASES.END_DAY && (
            <EndOfDaySummary gameState={gameState} />
          )}
        </GestureHandler>
        <button
          onClick={advancePhase}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          aria-label="Advance to next phase"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
          <UpdateToast />
      </div>
  );
};

export default MerchantsMorning;
