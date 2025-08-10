import React, { useState } from 'react';
import useGameState from './hooks/useGameState';
import useCrafting from './hooks/useCrafting';
import useCustomers from './hooks/useCustomers';
import PrepTabs from './features/PrepTabs';
import ShopInterface from './features/ShopInterface';
import BottomNavigation from './components/BottomNavigation';

const MerchantsMorning = () => {
  const [gameState, setGameState] = useGameState();
  const [currentPhase, setCurrentPhase] = useState('prep');
  const [currentPrepTab, setCurrentPrepTab] = useState('market');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const addEvent = () => {};
  const addNotification = () => {};

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

  const handlePhaseChange = (phase) => {
    setCurrentPhase(phase);
    if (phase === 'shop') {
      openShop();
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'uncommon':
        return 'rarity-uncommon';
      case 'rare':
        return 'rarity-rare';
      case 'legendary':
        return 'text-yellow-600';
      default:
        return 'rarity-common';
    }
  };

  return (
    <div className="pb-20 p-4">
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
        />
      ) : (
        <ShopInterface
          gameState={gameState}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          sellingTab={currentPrepTab}
          setSellingTab={setCurrentPrepTab}
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
    </div>
  );
};

export default MerchantsMorning;
