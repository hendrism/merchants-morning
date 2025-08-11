import React, { useState, useEffect, useRef } from 'react';
import { PHASES } from './constants';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
import GameHeader from './components/GameHeader';
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

  useEffect(() => {
    if (currentPhase === 'shop' && gameState.phase !== PHASES.SHOPPING) {
      openShop();
    }
  }, [currentPhase, gameState.phase, openShop]);

  useEffect(() => () => {
    notificationTimers.current.forEach(clearTimeout);
  }, []);

  const customerCount = gameState.customers.filter(c => !c.satisfied).length;

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
    if (phase === 'prep') {
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-200 pb-20">
      <GameHeader currentPhase={currentPhase} day={gameState.day} gold={gameState.gold} />
      <div className="space-y-4">
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
            onReadyToSell={() => handlePhaseChange('shop')}
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
      </div>
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
