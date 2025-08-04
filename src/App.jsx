// REPLACE YOUR src/App.jsx WITH THIS COMPLETE VERSION

import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { PHASES, MATERIALS, RECIPES, BOX_TYPES, ITEM_TYPES, RARITY_ORDER } from './constants';
import MorningPhase from './components/MorningPhase';
import CraftingPhase from './components/CraftingPhase';
import ShoppingPhase from './components/ShoppingPhase';
import EndDayPhase from './components/EndDayPhase';
import Footer from './components/Footer';

const MerchantsMorning = () => {

  const [gameState, setGameState] = useState({
    phase: PHASES.MORNING,
    day: 1,
    gold: 120,
    materials: { 
      iron: 3, 
      wood: 3, 
      fur: 2, 
      cloth: 2,
      stone: 2,
      bone: 1
    },
    inventory: {},
    customers: [],
    totalEarnings: 0,
    shopLevel: 1
  });

  const [eventLog, setEventLog] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEventLog, setShowEventLog] = useState(false);
  const [craftingTab, setCraftingTab] = useState('weapon');
  const [inventoryTab, setInventoryTab] = useState('weapon');
  const [sellingTab, setSellingTab] = useState('weapon');

  // Auto-switch selling tab when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      setSellingTab(selectedCustomer.requestType);
    }
  }, [selectedCustomer]);

  const addEvent = (message, type = 'info') => {
    const event = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setEventLog(prev => [event, ...prev.slice(0, 9)]);
  };

  const addNotification = (message, type = 'success') => {
    const notification = {
      id: Date.now(),
      message,
      type
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'uncommon': return 'text-green-600 bg-green-100 border-green-200';
      case 'rare': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRandomMaterial = (rarityWeights) => {
    const rand = Math.random() * 100;
    let threshold = 0;
    
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      threshold += weight;
      if (rand <= threshold) {
        const materialsOfRarity = Object.entries(MATERIALS).filter(([_, mat]) => mat.rarity === rarity);
        const randomMat = materialsOfRarity[Math.floor(Math.random() * materialsOfRarity.length)];
        return randomMat[0];
      }
    }
    return 'iron';
  };

  const openBox = (boxType) => {
    const box = BOX_TYPES[boxType];
    if (gameState.gold < box.cost) {
      addNotification("Not enough gold!", 'error');
      return;
    }

    const materialCount = Math.floor(Math.random() * (box.materialCount[1] - box.materialCount[0] + 1)) + box.materialCount[0];
    const newMaterials = { ...gameState.materials };
    const foundMaterials = [];
    
    for (let i = 0; i < materialCount; i++) {
      const material = getRandomMaterial(box.rarityWeights);
      newMaterials[material] = (newMaterials[material] || 0) + 1;
      foundMaterials.push(MATERIALS[material].name);
    }

    setGameState(prev => ({
      ...prev,
      gold: prev.gold - box.cost,
      materials: newMaterials
    }));

    addEvent(`Opened ${box.name}: Found ${foundMaterials.join(', ')}`, 'success');
    addNotification(`📦 Opened ${box.name}! Found ${materialCount} materials`, 'success');
  };

  const craftItem = (recipeId) => {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    for (const [material, needed] of Object.entries(recipe.ingredients)) {
      if ((gameState.materials[material] || 0) < needed) {
        addNotification(`Need more ${MATERIALS[material].name}!`, 'error');
        return;
      }
    }

    const newMaterials = { ...gameState.materials };
    for (const [material, needed] of Object.entries(recipe.ingredients)) {
      newMaterials[material] -= needed;
    }

    const newInventory = { ...gameState.inventory };
    newInventory[recipeId] = (newInventory[recipeId] || 0) + 1;

    setGameState(prev => ({
      ...prev,
      materials: newMaterials,
      inventory: newInventory
    }));

    addEvent(`Crafted ${recipe.name}`, 'success');
    addNotification(`🔨 Successfully crafted ${recipe.name}!`, 'success');
  };

  const generateCustomers = () => {
    const customerCount = Math.floor(Math.random() * 4) + 3;
    const customers = [];
    
    const getRarityWeights = (day) => {
      if (day <= 3) {
        return { common: 70, uncommon: 30, rare: 0 };
      } else if (day <= 6) {
        return { common: 50, uncommon: 40, rare: 10 };
      } else {
        return { common: 30, uncommon: 45, rare: 25 };
      }
    };
    
    const getRandomRarity = (weights) => {
      const rand = Math.random() * 100;
      let threshold = 0;
      for (const [rarity, weight] of Object.entries(weights)) {
        threshold += weight;
        if (rand <= threshold) return rarity;
      }
      return 'common';
    };
    
    for (let i = 0; i < customerCount; i++) {
      const requests = ['weapon', 'armor', 'trinket'];
      const rarityWeights = getRarityWeights(gameState.day);
      
      const requestType = requests[Math.floor(Math.random() * requests.length)];
      const requestRarity = getRandomRarity(rarityWeights);
      const basePrice = requestRarity === 'common' ? 15 : requestRarity === 'uncommon' ? 25 : 50;
      const offerPrice = Math.floor(basePrice * (0.9 + Math.random() * 0.3));
      
      const flexibility = Math.random();
      const isFlexible = flexibility > 0.6;
      
      customers.push({
        id: i,
        name: `Customer ${i + 1}`,
        requestType,
        requestRarity,
        offerPrice,
        satisfied: false,
        isFlexible,
        patience: Math.floor(Math.random() * 3) + 2
      });
    }
    
    return customers;
  };

  const openShop = () => {
    const customers = generateCustomers();
    setGameState(prev => ({
      ...prev,
      phase: PHASES.SHOPPING,
      customers
    }));
    addEvent(`Shop opened with ${customers.length} customers waiting`, 'info');
  };

  const serveCustomer = (customerId, itemId) => {
    const customer = gameState.customers.find(c => c.id === customerId);
    const recipe = RECIPES.find(r => r.id === itemId);
    
    if (!customer || !recipe || (gameState.inventory[itemId] || 0) < 1) return;

    let payment = customer.offerPrice;
    let satisfaction = 'perfect';

    const exactMatch = recipe.type === customer.requestType && recipe.rarity === customer.requestRarity;
    
    if (!exactMatch) {
      let penalty = 0.4;
      
      if (customer.isFlexible) {
        penalty = 0.2;
        satisfaction = 'good substitute';
      } else {
        satisfaction = 'reluctant';
      }
      
      const rarityOrder = { common: 1, uncommon: 2, rare: 3 };
      if (rarityOrder[recipe.rarity] > rarityOrder[customer.requestRarity]) {
        penalty -= 0.1;
        satisfaction = customer.isFlexible ? 'delighted upgrade' : 'acceptable upgrade';
      }
      
      if (recipe.type === customer.requestType) {
        penalty -= 0.1;
      }
      
      payment = Math.floor(payment * (1 - penalty));
    }

    const newInventory = { ...gameState.inventory };
    newInventory[itemId] -= 1;

    const newCustomers = gameState.customers.map(c => 
      c.id === customerId ? { ...c, satisfied: true, payment, satisfaction } : c
    );

    setGameState(prev => ({
      ...prev,
      inventory: newInventory,
      customers: newCustomers,
      gold: prev.gold + payment,
      totalEarnings: prev.totalEarnings + payment
    }));

    const matchText = exactMatch ? '(Perfect match!)' : `(${satisfaction})`;
    addEvent(`Sold ${recipe.name} to ${customer.name} for ${payment} gold ${matchText}`, 'success');
    addNotification(`💰 Sold ${recipe.name} for ${payment} gold!`, 'success');
    setSelectedCustomer(null);
  };

  const endDay = () => {
    setGameState(prev => ({
      ...prev,
      phase: PHASES.END_DAY
    }));
  };

  const startNewDay = () => {
    setGameState(prev => ({
      ...prev,
      phase: PHASES.MORNING,
      day: prev.day + 1,
      customers: []
    }));
    addEvent(`Started Day ${gameState.day + 1}`, 'info');
    setSelectedCustomer(null);
  };

  const canCraft = (recipe) => {
    return Object.entries(recipe.ingredients).every(([material, needed]) => 
      (gameState.materials[material] || 0) >= needed
    );
  };

  const getTopMaterials = () => {
    return Object.entries(gameState.materials)
      .filter(([_, count]) => count > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4);
  };


  const sortRecipesByRarityAndCraftability = (recipes) => {
    return recipes.sort((a, b) => {
      const canCraftA = canCraft(a);
      const canCraftB = canCraft(b);
      
      if (canCraftA && !canCraftB) return -1;
      if (!canCraftA && canCraftB) return 1;
      
      return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
    });
  };

  const sortByMatchQualityAndRarity = (inventoryItems, customer) => {
    return inventoryItems.sort((a, b) => {
      const recipeA = RECIPES.find(r => r.id === a[0]);
      const recipeB = RECIPES.find(r => r.id === b[0]);
      
      if (!customer) {
        return RARITY_ORDER[recipeB.rarity] - RARITY_ORDER[recipeA.rarity];
      }
      
      const getMatchScore = (recipe) => {
        const exactMatch = recipe.type === customer.requestType && recipe.rarity === customer.requestRarity;
        if (exactMatch) return 4;
        
        const rarityOrder = { common: 1, uncommon: 2, rare: 3 };
        if (rarityOrder[recipe.rarity] > rarityOrder[customer.requestRarity] && recipe.type === customer.requestType) {
          return 3;
        }
        if (recipe.type === customer.requestType) {
          return 2;
        }
        if (customer.isFlexible) {
          return 1;
        }
        return 0;
      };
      
      const scoreA = getMatchScore(recipeA);
      const scoreB = getMatchScore(recipeB);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      return RARITY_ORDER[recipeB.rarity] - RARITY_ORDER[recipeA.rarity];
    });
  };

  const filterRecipesByType = (type) => {
    return RECIPES.filter(recipe => recipe.type === type);
  };

  const filterInventoryByType = (type) => {
    return Object.entries(gameState.inventory)
      .filter(([_, count]) => count > 0)
      .filter(([itemId]) => {
        const recipe = RECIPES.find(r => r.id === itemId);
        return recipe && recipe.type === type;
      });
  };

  const TabButton = ({ active, onClick, children, count }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-t text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children} {count && <span className="ml-1 text-xs">({count})</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 pb-16">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-pulse ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto p-3">
        <div className="bg-white rounded-lg shadow-lg p-3 mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-amber-800">🏰 Merchant's Morning</h1>
            <p className="text-xs text-amber-600">Day {gameState.day} • {gameState.phase.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
              <Coins className="w-4 h-4" />
              {gameState.gold}
            </div>
            <button
              onClick={() => setShowEventLog(!showEventLog)}
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              <AlertCircle className="w-3 h-3" />
              Events {showEventLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {showEventLog && (
          <div className="bg-white rounded-lg shadow-lg p-3 mb-3">
            <div className="max-h-32 overflow-y-auto space-y-1">
              {eventLog.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No events yet...</p>
              ) : (
                eventLog.map(event => (
                  <div key={event.id} className="text-xs flex justify-between items-center">
                    <span className={`${
                      event.type === 'success' ? 'text-green-600' : 
                      event.type === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {event.message}
                    </span>
                    <span className="text-gray-400">{event.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {gameState.phase === PHASES.MORNING && (
          <MorningPhase
            gameState={gameState}
            openBox={openBox}
            continueToCrafting={() => setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }))}
            getRarityColor={getRarityColor}
          />
        )}

        {gameState.phase === PHASES.CRAFTING && (
          <CraftingPhase
            gameState={gameState}
            craftingTab={craftingTab}
            setCraftingTab={setCraftingTab}
            inventoryTab={inventoryTab}
            setInventoryTab={setInventoryTab}
            filterRecipesByType={filterRecipesByType}
            canCraft={canCraft}
            craftItem={craftItem}
            openShop={openShop}
            filterInventoryByType={filterInventoryByType}
            sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
            getRarityColor={getRarityColor}
          />
        )}

        {gameState.phase === PHASES.SHOPPING && (
          <ShoppingPhase
            gameState={gameState}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            sellingTab={sellingTab}
            setSellingTab={setSellingTab}
            endDay={endDay}
            filterInventoryByType={filterInventoryByType}
            sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
            serveCustomer={serveCustomer}
            getRarityColor={getRarityColor}
          />
        )}

        {gameState.phase === PHASES.END_DAY && (
          <EndDayPhase gameState={gameState} startNewDay={startNewDay} />
        )}
      </div>

      <Footer gameState={gameState} getTopMaterials={getTopMaterials} />
    </div>
  );
};

export default MerchantsMorning;
