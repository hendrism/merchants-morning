import React, { useState, useEffect, useRef } from 'react';
import { PHASES } from './constants';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
import EndOfDaySummary from './features/EndOfDaySummary';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import EventLog from './components/EventLog';
import Notifications from './components/Notifications';
import UpdateToast from './components/UpdateToast';
import useGameState from './hooks/useGameState';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import generateId from './utils/id';
import DebugConsole from './components/DebugConsole';

const MerchantsMorning = () => {
  const [gameState, setGameState, resetGame] = useGameState();
  const [gamePhase, setGamePhase] = useState('prep');
  const [currentPrepTab, setCurrentPrepTab] = useState('market');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const notificationTimers = useRef([]);
  const [showDebug, setShowDebug] = useState(false);
  const [showEventLog, setShowEventLog] = useState(true);

  const addEvent = (message, type = 'info') => {
    const event = {
      id: generateId(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEventLog(prev => [event, ...prev.slice(0, 9)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = { id: generateId(), message, type };
    setNotifications(prev => [...prev, notification]);
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      notificationTimers.current = notificationTimers.current.filter(t => t !== timer);
    }, 3000);
    notificationTimers.current.push(timer);
  };

  const {
    openBox,
    craftItem,
    canCraft,
    filterRecipesByType,
    filterInventoryByType,
    sortRecipesByRarityAndCraftability,
    sortByMatchQualityAndRarity,
    getSaleInfo,
  } = useCrafting(gameState, setGameState, addEvent, addNotification);

  const { openShop, serveCustomer, endDay, startNewDay } = useCustomers(
    gameState,
    setGameState,
    addEvent,
    addNotification,
    setSelectedCustomer
  );

  useEffect(() => () => {
    notificationTimers.current.forEach(clearTimeout);
  }, []);

  const customerCount = gameState.customers.filter(c => !c.satisfied).length;

  const handleOpenShop = () => {
    const hasInventory = Object.values(gameState.inventory).some(count => count > 0);
    if (!hasInventory) {
      addNotification('Craft some items first before opening your shop!', 'error');
      return;
    }
    openShop();
    setGamePhase('shop');
    addEvent('🛒 Shop opened for business!', 'success');
  };

  const handleCloseShop = () => {
    setGamePhase('end_day');
    endDay();
    setSelectedCustomer(null);
    addEvent('🏁 Shop closed for the day', 'info');
  };

  const handleStartNewDay = () => {
    startNewDay();
    setGamePhase('prep');
    setCurrentPrepTab('market');
    addEvent(`🌅 Started Day ${gameState.day + 1}`, 'success');
  };

  // Check if we're in development mode (more reliable check)
  const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  // Add keyboard shortcut for debug console (Ctrl+D or Cmd+D)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && isDevelopment) {
        e.preventDefault();
        setShowDebug(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isDevelopment]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-200">
      <Header 
        currentPhase={gamePhase} 
        day={gameState.day} 
        gold={gameState.gold}
        onOpenShop={handleOpenShop}
        onCloseShop={handleCloseShop}
        onStartNewDay={handleStartNewDay}
        gameState={gameState}
      />
      
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-24">
        {gamePhase === 'prep' && (
          <PrepTabs
            currentTab={currentPrepTab}
            onTabChange={setCurrentPrepTab}
            gameState={gameState}
            openBox={openBox}
            canCraft={canCraft}
            craftItem={craftItem}
            filterRecipesByType={filterRecipesByType}
            sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
            filterInventoryByType={filterInventoryByType}
          />
        )}

        {gamePhase === 'shop' && (
          <ShopInterface
            gameState={gameState}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            filterInventoryByType={filterInventoryByType}
            sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
            serveCustomer={serveCustomer}
            getSaleInfo={getSaleInfo}
          />
        )}

        {gamePhase === 'end_day' && (
          <EndOfDaySummary gameState={gameState} />
        )}
      </main>

      {gamePhase === 'prep' && (
        <BottomNavigation
          currentTab={currentPrepTab}
          onTabChange={setCurrentPrepTab}
        />
      )}

      <Notifications notifications={notifications} />
      
      {/* Collapsible Event Log */}
      {showEventLog && <EventLog events={eventLog} />}
      
      {/* Event Log Toggle Button */}
      <button
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
        onClick={() => setShowEventLog(prev => !prev)}
        title={showEventLog ? 'Hide Events' : 'Show Events'}
      >
        {showEventLog ? '📋' : '📝'}
      </button>

      <UpdateToast />

      {/* Debug Tools - Fixed visibility and positioning */}
      {isDevelopment && (
        <>
          {/* Debug Toggle Button - Always visible in development */}
          <button
            className="fixed top-20 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg z-[60] hover:bg-gray-700 transition-colors shadow-lg border border-gray-600"
            onClick={() => setShowDebug(prev => !prev)}
            title="Toggle Debug Console (Ctrl+D)"
          >
            <span className="flex items-center gap-2">
              <span>🔧</span>
              <span className="hidden sm:inline">
                {showDebug ? 'Close' : 'Debug'}
              </span>
            </span>
          </button>

          {/* Debug Console - Better positioning to avoid conflicts */}
          {showDebug && (
            <>
              {/* Backdrop for mobile */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-25 z-[55] md:hidden"
                onClick={() => setShowDebug(false)}
              />
              
              {/* Debug Console */}
              <div className="fixed top-28 right-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-xl z-[65] flex flex-col">
                {/* Console Header */}
                <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    🔧 Debug Console
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Day {gameState.day} • {gameState.gold}g
                    </div>
                    <button 
                      className="text-gray-600 hover:text-gray-800 text-xl leading-none"
                      onClick={() => setShowDebug(false)}
                      title="Close Debug Console"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                {/* Console Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  <DebugConsole
                    gameState={gameState}
                    setGameState={setGameState}
                    resetGame={resetGame}
                    openShop={openShop}
                    serveCustomer={serveCustomer}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Development mode indicator - Updated positioning */}
      {isDevelopment && (
        <div className="fixed top-20 left-4 bg-yellow-500 text-black px-2 py-1 rounded text-xs z-40">
          DEV
        </div>
      )}
    </div>
  );
};

export default MerchantsMorning;
