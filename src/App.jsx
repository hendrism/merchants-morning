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
      <EventLog events={eventLog} />
      <UpdateToast />

      {process.env.NODE_ENV !== 'production' && (
        <>
          <button
            className="fixed bottom-20 right-4 bg-gray-700 text-white px-3 py-1 rounded z-50"
            onClick={() => setShowDebug(prev => !prev)}
          >
            {showDebug ? 'Close Debug' : 'Debug'}
          </button>
          {showDebug && (
            <DebugConsole
              gameState={gameState}
              setGameState={setGameState}
              resetGame={resetGame}
              openShop={openShop}
              serveCustomer={serveCustomer}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MerchantsMorning;
