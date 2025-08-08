import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Coins, AlertCircle, Sun, Moon, Menu, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { PHASES, MATERIALS, BOX_TYPES, RECIPES } from './constants';
import { Card, CardHeader, CardContent } from './components/Card';
import Workshop from './features/Workshop';
import InventoryPanel from './features/InventoryPanel';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import Button from './components/Button';
import MaterialCard from './components/MaterialCard';
import GestureHandler from './components/GestureHandler';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import useGameState from './hooks/useGameState';
import ShopInterface from './features/ShopInterface';
import EndOfDaySummary from './features/EndOfDaySummary';
import useCardIntelligence from './hooks/useCardIntelligence';
import generateId from './utils/id';

const MerchantsMorning = () => {
  const [gameState, setGameState, resetGame] = useGameState();

  const PHASE_SEQUENCE = [PHASES.MORNING, PHASES.CRAFTING, PHASES.SHOPPING, PHASES.END_DAY];
  const PHASE_ICONS = {
    [PHASES.MORNING]: '🌅',
    [PHASES.CRAFTING]: '🔨',
    [PHASES.SHOPPING]: '🏪',
    [PHASES.END_DAY]: '🌙',
  };

  // Stable user preferences loader
  const [prefsVersion, setPrefsVersion] = useState(0);

  useEffect(() => {
    // React to external tab/localStorage updates
    const onStorage = (e) => {
      if (e.key === 'userCardPreferences') {
        setPrefsVersion(v => v + 1);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const userPreferences = useMemo(() => {
    try {
      const stored = window.localStorage.getItem('userCardPreferences');
      const parsed = stored ? JSON.parse(stored) : {};
      return {
        preferredExpansions: parsed.preferredExpansions || {},
        preferredCollapsed: parsed.preferredCollapsed || {},
      };
    } catch {
      return { preferredExpansions: {}, preferredCollapsed: {} };
    }
  }, [prefsVersion]);

  const cardIntelligence = useCardIntelligence(gameState, userPreferences, setGameState);

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
      const phase = gameState.phase;

      // Ensure containers exist
      prefs.preferredExpansions = prefs.preferredExpansions || {};
      prefs.preferredCollapsed = prefs.preferredCollapsed || {};
      prefs.preferredExpansions[phase] = prefs.preferredExpansions[phase] || [];
      prefs.preferredCollapsed[phase] = prefs.preferredCollapsed[phase] || [];

      if (newExpanded) {
        // Record expansion and un-record collapse
        if (!prefs.preferredExpansions[phase].includes(cardId)) {
          prefs.preferredExpansions[phase].push(cardId);
        }
        prefs.preferredCollapsed[phase] = prefs.preferredCollapsed[phase].filter(id => id !== cardId);
      } else {
        // Record collapse and un-record expansion
        if (!prefs.preferredCollapsed[phase].includes(cardId)) {
          prefs.preferredCollapsed[phase].push(cardId);
        }
        prefs.preferredExpansions[phase] = prefs.preferredExpansions[phase].filter(id => id !== cardId);
      }

      window.localStorage.setItem('userCardPreferences', JSON.stringify(prefs));
      setPrefsVersion(v => v + 1);
    } catch (e) {
      console.error('Failed to save card preferences', e);
    }
  }, [getCardState, updateCardState, trackCardUsage, gameState.phase]);

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
  const getCategoryIcon = (type) => {
    const icons = {
      metal: '⛓️',
      wood: '🪵',
      cloth: '🧵',
      gem: '💎',
      leather: '🪶',
      other: '📦',
    };
    return icons[type] || '📦';
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

  const totalRecipes = RECIPES.length;
  const craftableRecipes = RECIPES.filter(canCraft).length;

  const marketNewsStatus = getCardStatus('marketNews', gameState);
  const supplyBoxesStatus = getCardStatus('supplyBoxes', gameState);
  const materialsStatus = getCardStatus('materials', gameState);
  const workshopStatus = getCardStatus('workshop', { ...gameState, craftableCount: craftableRecipes, totalRecipeCount: totalRecipes });
  const inventoryStatus = getCardStatus('inventory', gameState);
  const customerQueueStatus = getCardStatus('customerQueue', gameState);

  // NEW: Gesture handlers
  const handleSwipeGesture = useCallback((direction) => {
    if (direction === 'left') {
      // Advance to next phase
      switch (gameState.phase) {
        case PHASES.MORNING:
          setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }));
          addNotification('⚒️ Swiped to Crafting', 'info');
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
  }, [gameState.phase, setGameState, addNotification, openShop, endDay, startNewDay]);

  const handleCardSwipe = useCallback((direction, cardId) => {
    if (direction === 'left') {
      updateCardState(cardId, { expanded: false });
    } else if (direction === 'right') {
      updateCardState(cardId, { expanded: true });
      trackCardUsage(cardId, 'expand');
    }
  }, [updateCardState, trackCardUsage]);



  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-20 pb-safe dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <Notifications notifications={notifications} />
      <GestureHandler
        onSwipe={(direction, e, startEl) => {
          const card = (startEl || e.target).closest('[data-card-id]');
          if (card) {
            handleCardSwipe(direction, card.dataset.cardId);
          } else {
            handleSwipeGesture(direction);
          }
        }}
        className="max-w-6xl mx-auto p-3"
      >
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-amber-800 dark:text-amber-300">🏰 Merchant's Morning</h1>
              <p className="text-sm sm:text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <span>Day {gameState.day}</span>
                <span className="flex items-center gap-1">
                  {PHASE_SEQUENCE.map(phase => (
                    <span
                      key={phase}
                      className={phase === gameState.phase ? 'text-base' : 'opacity-40'}
                    >
                      {PHASE_ICONS[phase]}
                    </span>
                  ))}
                </span>
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

        {!getCardState('marketNews').hidden && [PHASES.MORNING, PHASES.CRAFTING].includes(gameState.phase) && (
          <div data-card-id="marketNews">
            <Card>
              <CardHeader
                icon="📈"
                title="Market News"
                subtitle={marketNewsStatus.subtitle}
                subtitleClassName={marketNewsStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('marketNews').expanded}
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

        {gameState.phase === PHASES.MORNING && (
          <>
            {!getCardState('supplyBoxes').hidden && (
              <div data-card-id="supplyBoxes">
                <Card>
                  <CardHeader
                    icon="🛍️"
                    title="Supply Boxes"
                    subtitle={supplyBoxesStatus.subtitle}
                    subtitleClassName={supplyBoxesStatus.status === 'locked' ? 'text-red-600' : ''}
                    expanded={getCardState('supplyBoxes').expanded}
                    onToggle={() => handleCardToggle('supplyBoxes')}
                    status={supplyBoxesStatus.status}
                    badge={supplyBoxesStatus.badge}
                  />
                  {getCardState('supplyBoxes').expanded && (
                    <CardContent expanded={getCardState('supplyBoxes').expanded}>
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
              </div>
            )}

            {!getCardState('materials').hidden && (
              <div data-card-id="materials">
                <Card>
                  <CardHeader
                    icon="🧰"
                    title="Materials"
                    subtitle={materialsStatus.subtitle}
                    subtitleClassName={materialsStatus.status === 'locked' ? 'text-red-600' : ''}
                    expanded={getCardState('materials').expanded}
                    onToggle={() => handleCardToggle('materials')}
                    isEmpty={materialsStatus.badge === 0}
                    status={materialsStatus.status}
                    badge={materialsStatus.badge}
                  />
                  {getCardState('materials').expanded && (
                    <CardContent expanded={getCardState('materials').expanded}>
            {Object.keys(materialsByType).length > 0 ? (
              <div className="material-categories space-y-2">
                {Object.entries(materialsByType).map(([type, mats]) => (
                  <div key={type} className="category-row flex items-start gap-2">
                    <div className="category-icon text-lg">{getCategoryIcon(type)}</div>
                    <div className="materials-row flex flex-wrap gap-2">
                      {mats.map(({ id, count, material }) => (
                        <MaterialCard key={id} material={material} count={count} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">No materials</p>
            )}
                    </CardContent>
                  )}
                </Card>
              </div>
            )}
          </>
        )}

        {!getCardState('workshop').hidden && [PHASES.MORNING, PHASES.CRAFTING].includes(gameState.phase) && (
          <div data-card-id="workshop">
            <Card>
              <CardHeader
                icon="🔨"
                title="Workshop"
                expanded={getCardState('workshop').expanded}
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

        {!getCardState('inventory').hidden && gameState.phase === PHASES.CRAFTING && (
          <div data-card-id="inventory">
            <Card>
              <CardHeader
                icon="📦"
                title="Inventory"
                subtitle={inventoryStatus.subtitle}
                subtitleClassName={inventoryStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('inventory').expanded}
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

        {!getCardState('customerQueue').hidden && gameState.phase === PHASES.SHOPPING && (
          <div data-card-id="customerQueue">
            <Card>
              <CardHeader
                icon="👥"
                title="Customers"
                subtitle={customerQueueStatus.subtitle}
                subtitleClassName={customerQueueStatus.status === 'locked' ? 'text-red-600' : ''}
                expanded={getCardState('customerQueue').expanded}
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

              <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg pb-safe dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-6xl mx-auto flex items-center h-[70px]">
                    <div className="resource-summary-text flex items-center gap-3 overflow-x-auto flex-[7] px-4 min-w-0">
                      {getTopMaterials().map(([materialId, count]) => (
                        <span key={materialId} className="resource-chip flex items-center gap-1 text-lg whitespace-nowrap flex-shrink-0">
                          {MATERIALS[materialId].icon} {count}
                        </span>
                      ))}
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
                        aria-label="Start Crafting"
                      >
                        ⚒️
                      </Button>
                    )}
                    {gameState.phase === PHASES.CRAFTING && (
                      <Button
                        onClick={openShop}
                        className="w-full h-12 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 shadow"
                        aria-label="Open Shop"
                      >
                        🏪
                      </Button>
                    )}
                    {gameState.phase === PHASES.SHOPPING && (
                      <Button
                        onClick={endDay}
                        className="w-full h-12 rounded-lg font-bold text-white bg-purple-500 hover:bg-purple-600 shadow"
                        aria-label="Close Shop"
                      >
                        🔒
                      </Button>
                    )}
                    {gameState.phase === PHASES.END_DAY && (
                      <Button
                        onClick={startNewDay}
                        className="w-full h-12 rounded-lg font-bold text-white bg-amber-500 hover:bg-amber-600 shadow"
                        aria-label="New Day"
                      >
                        🌅
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
};

            export default MerchantsMorning;
