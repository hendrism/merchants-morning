import React, { useState, useEffect, useRef } from 'react';
import { PHASES } from './constants';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
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
  const [currentPhase, setCurrentPhase] = useState('prep');
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

  const { openShop, serveCustomer } = useCustomers(
    gameState,
    setGameState,
    addEvent,
    addNotification,
    setSelectedCustomer
  );

  // Auto-switch to shopping phase when opening shop
  useEffect(() => {
    if (currentPhase === 'shop' && gameState.phase !== PHASES.SHOPPING) {
      openShop();
    }
  }, [currentPhase, gameState.phase, openShop]);

  // Clean up notification timers on unmount
  useEffect(() => () => {
    notificationTimers.current.forEach(clearTimeout);
  }, []);

  // Calculate customer count for bottom navigation
  const customerCount = gameState.customers.filter(c => !c.satisfied).length;

  // Handle phase transitions
  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
    if (phase === 'prep') {
      setSelectedCustomer(null);
      // Smart tab selection based on current state
      if (Object.values(gameState.inventory).some(count => count > 0)) {
        setCurrentPrepTab('items'); // If they have items, show inventory
      } else if (Object.values(gameState.materials).some(count => count > 0)) {
        setCurrentPrepTab('workshop'); // If they have materials, show workshop
      } else {
        setCurrentPrepTab('market'); // Otherwise, start with market
      }
    }
  };

  // Handle ready to sell transition
  const handleReadyToSell = () => {
    const hasInventory = Object.values(gameState.inventory).some(count => count > 0);
    if (!hasInventory) {
      addNotification('Craft some items first before opening your shop!', 'error');
      return;
    }
    handlePhaseChange('shop');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-200">
      <Header currentPhase={currentPhase} day={gameState.day} gold={gameState.gold} />
      
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-32">
        {currentPhase === 'prep' ? (
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
            onReadyToSell={handleReadyToSell}
          />
        ) : (
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
      </main>

      <BottomNavigation
        currentPhase={currentPhase}
        onPhaseChange={handlePhaseChange}
        customerCount={customerCount}
      />

      <Notifications notifications={notifications} />
      <EventLog events={eventLog} />
      <UpdateToast />
    </div>
  );
};

export default MerchantsMorning;
