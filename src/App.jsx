import React, { useState } from 'react';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
import BottomNavigation from './components/BottomNavigation';
import Notifications from './components/Notifications';
import EventLog from './components/EventLog';
import useGameState from './hooks/useGameState';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';

const App = () => {
  const [gameState, setGameState] = useGameState();
  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('prep');
  const [currentPrepTab, setCurrentPrepTab] = useState('market');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const addEvent = (message, type = 'info') => {
    const event = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEventLog(prev => [event, ...prev.slice(0, 49)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = { id: Date.now() + Math.random(), message, type };
    setNotifications(prev => [...prev, notification]);
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

  const getRarityColor = rarity => {
    switch (rarity) {
      case 'common':
        return 'rarity-common';
      case 'uncommon':
        return 'rarity-uncommon';
      case 'rare':
        return 'rarity-rare';
      default:
        return '';
    }
  };

  const handlePhaseChange = phase => {
    if (phase === 'shop') {
      openShop();
    }
    if (phase === 'prep') {
      setSelectedCustomer(null);
    }
    setCurrentPhase(phase);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-4">
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
          getRarityColor={getRarityColor}
        />
      ) : (
        <ShopInterface
          gameState={gameState}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          filterInventoryByType={filterInventoryByType}
          sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
          serveCustomer={serveCustomer}
          getRarityColor={getRarityColor}
          getSaleInfo={getSaleInfo}
        />
      )}
      <BottomNavigation
        currentPhase={currentPhase}
        onPhaseChange={handlePhaseChange}
        customerCount={gameState.customers.filter(c => !c.satisfied).length}
      />
      <Notifications notifications={notifications} />
      <EventLog events={eventLog} />
    </div>
  );
};

export default App;
