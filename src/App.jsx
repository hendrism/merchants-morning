import React, { useState, useEffect, useRef } from 'react';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
import BottomNavigation from './components/BottomNavigation';
import useGameState from './hooks/useGameState';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import Notifications from './components/Notifications';
import EventLog from './components/EventLog';
import generateId from './utils/id';

const MerchantsMorning = () => {
  const [gameState, setGameState] = useGameState();
  const [currentPhase, setCurrentPhase] = useState('prep');
  const [currentPrepTab, setCurrentPrepTab] = useState('market');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sellingTab, setSellingTab] = useState('weapon');
  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const notificationTimers = useRef([]);

  const addEvent = (message, type = 'info') => {
    const event = { id: generateId(), message, type, timestamp: new Date().toLocaleTimeString() };
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

  useEffect(() => () => notificationTimers.current.forEach(clearTimeout), []);

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'uncommon':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rare':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const {
    openBox,
    craftItem,
    canCraft,
    filterInventoryByType,
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

  const handlePhaseChange = phase => {
    setCurrentPhase(phase);
    if (phase === 'shop') {
      openShop();
    } else if (phase === 'prep') {
      setSelectedCustomer(null);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      setSellingTab(selectedCustomer.requestType);
    }
  }, [selectedCustomer]);

  return (
    <div className="pb-16 p-4 space-y-4">
      {currentPhase === 'prep' && (
        <PrepTabs
          currentTab={currentPrepTab}
          onTabChange={setCurrentPrepTab}
          gameState={gameState}
          openBox={openBox}
          canCraft={canCraft}
          craftItem={craftItem}
        />
      )}
      {currentPhase === 'shop' && (
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
      )}
      <EventLog events={eventLog} onClose={() => setEventLog([])} />
      <Notifications notifications={notifications} />
      <BottomNavigation
        currentPhase={currentPhase}
        onPhaseChange={handlePhaseChange}
        customerCount={gameState.customers.filter(c => !c.satisfied).length}
      />
    </div>
  );
};

export default MerchantsMorning;
