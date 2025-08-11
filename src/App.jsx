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

const MerchantsMorning = () => {
  const [gameState, setGameState] = useGameState();
  const [gamePhase, setGamePhase] = useState('prep'); // prep, shop, end_day
  const [currentPrepTab, setCurrentPrepTab] = useState('market');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const notificationTimers = useRef([]);

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

  // Clean up notification timers on unmount
  useEffect(() => () => {
    notificationTimers.current.forEach(clearTimeout);
  }, []);

  // Calculate customer count
  const customerCount = gameState.customers.filter(c => !c.satisfied).length;

  // Phase progression handlers
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

  // Render phase-specific action button
  const renderPhaseButton = () => {
    switch (gamePhase) {
      case 'prep':
        return (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={handleOpenShop}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
            >
              🛒 Open Shop
            </button>
          </div>
        );
      case 'shop':
        return (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={handleCloseShop}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2"
            >
              🏁 Close Shop
            </button>
          </div>
        );
      case 'end_day':
        return (
          <div className="fixed top-4 right-4 z-40">
            <button
              onClick={handleStartNewDay}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
            >
              🌅 New Day
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-200">
      <Header currentPhase={gamePhase} day={gameState.day} gold={gameState.gold} />
      
      {renderPhaseButton()}
      
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

      {/* Only show bottom nav during prep phase */}
      {gamePhase === 'prep' && (
        <BottomNavigation
          currentTab={currentPrepTab}
          onTabChange={setCurrentPrepTab}
        />
      )}

      <Notifications notifications={notifications} />
      <EventLog events={eventLog} />
      <UpdateToast />
    </div>
  );
};

export default MerchantsMorning;
