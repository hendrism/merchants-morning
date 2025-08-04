import React, { useState, useEffect } from 'react';
import { Package, Hammer, Store, Star, Coins, ChevronRight, X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import TabButton from './components/TabButton';
import Notifications from './components/Notifications';
import EventLog from './components/EventLog';
import { PHASES, MATERIALS, RECIPES, BOX_TYPES, ITEM_TYPES, RARITY_ORDER } from './constants';

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

  // Item categories and rarity ranking moved to constants.js

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

  return (
    <div>
      <Notifications notifications={notifications} />
      <h1>🏰 Merchant's Morning</h1>
      <p>
        Day {gameState.day} • {gameState.phase.replace('_', ' ').toUpperCase()}
      </p>
      <p>Gold: {gameState.gold}</p>
      <button onClick={() => setShowEventLog(!showEventLog)}>
        Events {showEventLog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {showEventLog && <EventLog events={eventLog} />}

      {gameState.phase === PHASES.MORNING && (
        <div>
          <h2>Supply Boxes</h2>
          {Object.entries(BOX_TYPES).map(([type, box]) => (
            <div key={type}>
              <div>{box.name}</div>
              <div>
                {box.materialCount[0]}-{box.materialCount[1]} materials
              </div>
              <button onClick={() => openBox(type)} disabled={gameState.gold < box.cost}>
                {box.cost} Gold
              </button>
            </div>
          ))}
          <button onClick={() => setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }))}>
            Continue to Crafting
          </button>
          <h3>Materials</h3>
          {Object.entries(gameState.materials)
            .filter(([_, count]) => count > 0)
            .map(([materialId, count]) => {
              const material = MATERIALS[materialId];
              return (
                <div key={materialId}>
                  {material.icon} {material.name}: {count}
                </div>
              );
            })}
        </div>
      )}

      {gameState.phase === PHASES.CRAFTING && (
        <div>
          <h2>Crafting Workshop</h2>
          <div>
            {ITEM_TYPES.map(type => (
              <TabButton
                key={type}
                active={craftingTab === type}
                onClick={() => setCraftingTab(type)}
              >
                {type}
              </TabButton>
            ))}
          </div>
          {sortRecipesByRarityAndCraftability(filterRecipesByType(craftingTab)).map(recipe => (
            <div key={recipe.id}>
              <div>
                {recipe.name} ({recipe.rarity})
              </div>
              <button onClick={() => craftItem(recipe.id)} disabled={!canCraft(recipe)}>
                {canCraft(recipe) ? 'Craft' : 'Need Materials'}
              </button>
            </div>
          ))}
          <button onClick={() => setGameState(prev => ({ ...prev, phase: PHASES.SHOPPING }))}>
            Open Shop
          </button>
          <h3>Inventory</h3>
          <div>
            {ITEM_TYPES.map(type => (
              <TabButton
                key={type}
                active={inventoryTab === type}
                onClick={() => setInventoryTab(type)}
              >
                {type}
              </TabButton>
            ))}
          </div>
          {filterInventoryByType(inventoryTab).map(([itemId, count]) => {
            const recipe = RECIPES.find(r => r.id === itemId);
            return (
              <div key={itemId}>
                {recipe.name} - {count}
              </div>
            );
          })}
        </div>
      )}

      {gameState.phase === PHASES.SHOPPING && (
        <div>
          <h2>Shopping</h2>
          <button onClick={() => setGameState(prev => ({ ...prev, phase: PHASES.END_DAY }))}>
            Close Shop for Today
          </button>
        </div>
      )}

      {gameState.phase === PHASES.END_DAY && (
        <div>
          <h2>Day {gameState.day} Complete!</h2>
          <button onClick={() => startNewDay()}>Start Day {gameState.day + 1}</button>
        </div>
      )}
    </div>
  );
};

export default MerchantsMorning;
