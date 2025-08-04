// REPLACE YOUR src/App.jsx WITH THIS COMPLETE VERSION

import React, { useState, useEffect } from 'react';
import { Package, Hammer, Store, Star, Coins, ChevronRight, X, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const MerchantsMorning = () => {
  const PHASES = {
    MORNING: 'morning',
    CRAFTING: 'crafting', 
    SHOPPING: 'shopping',
    END_DAY: 'end_day'
  };

  const MATERIALS = {
    iron: { name: 'Iron', rarity: 'common', icon: '⚙️' },
    wood: { name: 'Wood', rarity: 'common', icon: '🪵' },
    fur: { name: 'Fur', rarity: 'common', icon: '🦫' },
    cloth: { name: 'Cloth', rarity: 'common', icon: '🧵' },
    stone: { name: 'Stone', rarity: 'common', icon: '🪨' },
    bone: { name: 'Bone', rarity: 'common', icon: '🦴' },
    leather: { name: 'Leather', rarity: 'uncommon', icon: '🪖' },
    silver_ore: { name: 'Silver Ore', rarity: 'uncommon', icon: '🥈' },
    silk: { name: 'Silk', rarity: 'uncommon', icon: '🕸️' },
    bronze: { name: 'Bronze', rarity: 'uncommon', icon: '🔶' },
    gemstone: { name: 'Gemstone', rarity: 'rare', icon: '💎' },
    gold_ore: { name: 'Gold Ore', rarity: 'rare', icon: '✨' },
    crystal: { name: 'Crystal', rarity: 'rare', icon: '🔮' },
    mithril: { name: 'Mithril', rarity: 'rare', icon: '⚡' },
    ruby: { name: 'Ruby', rarity: 'rare', icon: '♦️' },
    obsidian: { name: 'Obsidian', rarity: 'rare', icon: '⬛' }
  };

  const RECIPES = [
    { id: 'iron_dagger', name: 'Iron Dagger', ingredients: { iron: 1, wood: 1 }, type: 'weapon', rarity: 'common', sellPrice: 10 },
    { id: 'wooden_club', name: 'Wooden Club', ingredients: { wood: 2, stone: 1 }, type: 'weapon', rarity: 'common', sellPrice: 8 },
    { id: 'stone_axe', name: 'Stone Axe', ingredients: { stone: 2, wood: 1 }, type: 'weapon', rarity: 'common', sellPrice: 12 },
    { id: 'iron_sword', name: 'Iron Sword', ingredients: { iron: 2, wood: 1, leather: 1 }, type: 'weapon', rarity: 'uncommon', sellPrice: 25 },
    { id: 'silver_blade', name: 'Silver Blade', ingredients: { silver_ore: 2, wood: 1 }, type: 'weapon', rarity: 'uncommon', sellPrice: 28 },
    { id: 'bronze_spear', name: 'Bronze Spear', ingredients: { bronze: 1, wood: 2 }, type: 'weapon', rarity: 'uncommon', sellPrice: 22 },
    { id: 'crystal_staff', name: 'Crystal Staff', ingredients: { wood: 1, crystal: 2 }, type: 'weapon', rarity: 'rare', sellPrice: 60 },
    { id: 'obsidian_blade', name: 'Obsidian Blade', ingredients: { obsidian: 2, mithril: 1 }, type: 'weapon', rarity: 'rare', sellPrice: 75 },
    { id: 'runed_sword', name: 'Runed Sword', ingredients: { mithril: 2, ruby: 1, silk: 1 }, type: 'weapon', rarity: 'rare', sellPrice: 80 },
    { id: 'cloth_robe', name: 'Cloth Robe', ingredients: { cloth: 3, fur: 1 }, type: 'armor', rarity: 'common', sellPrice: 18 },
    { id: 'wooden_shield', name: 'Wooden Shield', ingredients: { wood: 3 }, type: 'armor', rarity: 'common', sellPrice: 12 },
    { id: 'fur_vest', name: 'Fur Vest', ingredients: { fur: 3, bone: 1 }, type: 'armor', rarity: 'common', sellPrice: 15 },
    { id: 'leather_cap', name: 'Leather Cap', ingredients: { fur: 2, leather: 1 }, type: 'armor', rarity: 'uncommon', sellPrice: 25 },
    { id: 'bronze_helmet', name: 'Bronze Helmet', ingredients: { bronze: 2, cloth: 1 }, type: 'armor', rarity: 'uncommon', sellPrice: 30 },
    { id: 'silk_cloak', name: 'Silk Cloak', ingredients: { silk: 2, silver_ore: 1 }, type: 'armor', rarity: 'uncommon', sellPrice: 32 },
    { id: 'mithril_chainmail', name: 'Mithril Chainmail', ingredients: { mithril: 3, silk: 1 }, type: 'armor', rarity: 'rare', sellPrice: 65 },
    { id: 'crystal_armor', name: 'Crystal Armor', ingredients: { crystal: 2, mithril: 2 }, type: 'armor', rarity: 'rare', sellPrice: 70 },
    { id: 'golden_breastplate', name: 'Golden Breastplate', ingredients: { gold_ore: 3, gemstone: 1 }, type: 'armor', rarity: 'rare', sellPrice: 78 },
    { id: 'bone_charm', name: 'Bone Charm', ingredients: { bone: 2, cloth: 1 }, type: 'trinket', rarity: 'common', sellPrice: 14 },
    { id: 'wooden_talisman', name: 'Wooden Talisman', ingredients: { wood: 2, stone: 1 }, type: 'trinket', rarity: 'common', sellPrice: 16 },
    { id: 'iron_ring', name: 'Iron Ring', ingredients: { iron: 2, fur: 1 }, type: 'trinket', rarity: 'common', sellPrice: 13 },
    { id: 'silver_amulet', name: 'Silver Amulet', ingredients: { silver_ore: 2, silk: 1 }, type: 'trinket', rarity: 'uncommon', sellPrice: 26 },
    { id: 'bronze_pendant', name: 'Bronze Pendant', ingredients: { bronze: 1, leather: 1, stone: 1 }, type: 'trinket', rarity: 'uncommon', sellPrice: 24 },
    { id: 'enchanted_bracelet', name: 'Enchanted Bracelet', ingredients: { silver_ore: 1, bone: 2 }, type: 'trinket', rarity: 'uncommon', sellPrice: 28 },
    { id: 'gem_ring', name: 'Gem Ring', ingredients: { gold_ore: 1, gemstone: 1 }, type: 'trinket', rarity: 'rare', sellPrice: 50 },
    { id: 'ruby_crown', name: 'Ruby Crown', ingredients: { gold_ore: 2, ruby: 2 }, type: 'trinket', rarity: 'rare', sellPrice: 85 },
    { id: 'crystal_orb', name: 'Crystal Orb', ingredients: { crystal: 2, mithril: 1, silk: 1 }, type: 'trinket', rarity: 'rare', sellPrice: 72 }
  ];

  const BOX_TYPES = {
    bronze: { name: 'Bronze Box', cost: 20, materialCount: [5, 7], rarityWeights: { common: 75, uncommon: 25, rare: 0 } },
    silver: { name: 'Silver Box', cost: 45, materialCount: [6, 9], rarityWeights: { common: 45, uncommon: 45, rare: 10 } },
    gold: { name: 'Gold Box', cost: 85, materialCount: [7, 10], rarityWeights: { common: 25, uncommon: 55, rare: 20 } }
  };

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

  const ITEM_TYPES = ['weapon', 'armor', 'trinket'];
  const RARITY_ORDER = { rare: 3, uncommon: 2, common: 1 };

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Supply Boxes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {Object.entries(BOX_TYPES).map(([type, box]) => (
                  <div key={type} className="border rounded-lg p-3 text-center hover:bg-gray-50">
                    <h3 className="font-bold capitalize text-sm mb-1">{box.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {box.materialCount[0]}-{box.materialCount[1]} materials
                    </p>
                    <button
                      onClick={() => openBox(type)}
                      disabled={gameState.gold < box.cost}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-3 py-2 rounded font-bold text-sm"
                    >
                      {box.cost} Gold
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setGameState(prev => ({ ...prev, phase: PHASES.CRAFTING }))}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                Continue to Crafting <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-bold mb-3">Materials</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(gameState.materials).filter(([_, count]) => count > 0).map(([materialId, count]) => {
                  const material = MATERIALS[materialId];
                  return (
                    <div key={materialId} className={`p-2 rounded text-xs ${getRarityColor(material.rarity)}`}>
                      <span className="mr-1">{material.icon}</span>
                      {material.name}: {count}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameState.phase === PHASES.CRAFTING && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Hammer className="w-4 h-4" />
                Crafting Workshop
              </h2>
              
              <div className="flex gap-1 mb-3">
                {ITEM_TYPES.map(type => {
                  const allRecipes = filterRecipesByType(type);
                  const craftableCount = allRecipes.filter(recipe => canCraft(recipe)).length;
                  const totalCount = allRecipes.length;
                  return (
                    <TabButton
                      key={type}
                      active={craftingTab === type}
                      onClick={() => setCraftingTab(type)}
                      count={`${craftableCount}/${totalCount}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TabButton>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 max-h-80 overflow-y-auto">
                {sortRecipesByRarityAndCraftability(filterRecipesByType(craftingTab)).map(recipe => (
                  <div key={recipe.id} className={`border rounded-lg p-2 ${canCraft(recipe) ? 'border-green-300 bg-green-50' : 'border-gray-200 opacity-75'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h4 className={`font-bold text-xs ${canCraft(recipe) ? 'text-black' : 'text-gray-500'}`}>{recipe.name}</h4>
                        <p className={`text-xs px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                          {recipe.rarity}
                        </p>
                      </div>
                      <button
                        onClick={() => craftItem(recipe.id)}
                        disabled={!canCraft(recipe)}
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          canCraft(recipe) 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canCraft(recipe) ? '✓ Craft' : '✗ Need Materials'}
                      </button>
                    </div>
                    <div className="text-xs text-gray-600">
                      {Object.entries(recipe.ingredients).map(([mat, count]) => {
                        const have = gameState.materials[mat] || 0;
                        const hasEnough = have >= count;
                        return (
                          <span key={mat} className={`mr-2 ${hasEnough ? 'text-green-600' : 'text-red-600'}`}>
                            {MATERIALS[mat].icon}{count}({have})
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={openShop}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                Open Shop <Store className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-bold mb-3">Inventory</h3>
              
              <div className="flex gap-1 mb-3">
                {ITEM_TYPES.map(type => {
                  const count = filterInventoryByType(type).length;
                  return (
                    <TabButton
                      key={type}
                      active={inventoryTab === type}
                      onClick={() => setInventoryTab(type)}
                      count={count}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TabButton>
                  );
                })}
              </div>

              <div className="space-y-2">
                {filterInventoryByType(inventoryTab)
                  .sort(([itemIdA], [itemIdB]) => {
                    const recipeA = RECIPES.find(r => r.id === itemIdA);
                    const recipeB = RECIPES.find(r => r.id === itemIdB);
                    return RARITY_ORDER[recipeB.rarity] - RARITY_ORDER[recipeA.rarity];
                  })
                  .map(([itemId, count]) => {
                  const recipe = RECIPES.find(r => r.id === itemId);
                  return (
                    <div key={itemId} className={`p-2 rounded text-xs border ${getRarityColor(recipe.rarity)}`}>
                      <div className="font-bold">{recipe.name}</div>
                      <div className="text-gray-600">Stock: {count} • {recipe.sellPrice}g each</div>
                    </div>
                  );
                })}
                {filterInventoryByType(inventoryTab).length === 0 && (
                  <p className="text-xs text-gray-500 italic">No {inventoryTab}s crafted yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState.phase === PHASES.SHOPPING && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Store className="w-4 h-4" />
                Select Customer ({gameState.customers.filter(c => !c.satisfied).length} waiting)
              </h2>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {gameState.customers.filter(c => !c.satisfied).map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setSellingTab(customer.requestType);
                    }}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                      selectedCustomer?.id === customer.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-bold">
                      {customer.name}
                      {customer.isFlexible && <span className="ml-1">😊</span>}
                    </div>
                    <div className="text-xs opacity-80">
                      {customer.requestRarity} {customer.requestType} • {customer.offerPrice}g
                    </div>
                  </button>
                ))}
              </div>

              {gameState.customers.filter(c => c.satisfied).length > 0 && (
                <div className="mt-3 p-2 bg-green-50 rounded border-green-200 border">
                  <p className="text-sm text-green-700">
                    ✅ Served: {gameState.customers.filter(c => c.satisfied).map(c => `${c.name} (${c.payment}g)`).join(', ')}
                  </p>
                </div>
              )}

              <button
                onClick={endDay}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-bold"
              >
                Close Shop for Today
              </button>
            </div>

            {selectedCustomer && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="font-medium text-blue-800">
                  Selling to: {selectedCustomer.name} (wants {selectedCustomer.requestRarity} {selectedCustomer.requestType} • offers {selectedCustomer.offerPrice}g)
                  {selectedCustomer.isFlexible && <span className="text-blue-600"> • Flexible with substitutes 😊</span>}
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-bold mb-3">Your Items for Sale</h3>
              
              {!selectedCustomer && (
                <p className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
                  👆 Select a customer above to see item pricing and sell items
                </p>
              )}
              
              <div className="flex gap-1 mb-3">
                {ITEM_TYPES.map(type => {
                  const count = filterInventoryByType(type).length;
                  return (
                    <TabButton
                      key={type}
                      active={sellingTab === type}
                      onClick={() => setSellingTab(type)}
                      count={count}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </TabButton>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {sortByMatchQualityAndRarity(filterInventoryByType(sellingTab), selectedCustomer).map(([itemId, count]) => {
                  const recipe = RECIPES.find(r => r.id === itemId);
                  
                  let saleInfo = null;
                  let cardStyle = 'border-gray-200 bg-white';
                  
                  if (selectedCustomer) {
                    const exactMatch = recipe.type === selectedCustomer.requestType && recipe.rarity === selectedCustomer.requestRarity;
                    let payment = selectedCustomer.offerPrice;
                    let status = 'perfect';
                    
                    if (!exactMatch) {
                      let penalty = selectedCustomer.isFlexible ? 0.2 : 0.4;
                      const rarityOrder = { common: 1, uncommon: 2, rare: 3 };
                      if (rarityOrder[recipe.rarity] > rarityOrder[selectedCustomer.requestRarity]) {
                        penalty -= 0.1;
                        status = 'upgrade';
                      } else if (recipe.type === selectedCustomer.requestType) {
                        status = 'wrong_rarity';
                      } else {
                        status = 'substitute';
                      }
                      payment = Math.floor(payment * (1 - penalty));
                    }
                    
                    saleInfo = { payment, status, exactMatch };
                    
                    if (saleInfo.exactMatch) {
                      cardStyle = 'border-green-300 bg-green-50';
                    } else if (saleInfo.status === 'upgrade') {
                      cardStyle = 'border-blue-300 bg-blue-50';
                    } else if (saleInfo.status === 'wrong_rarity' || (saleInfo.status === 'substitute' && selectedCustomer.isFlexible)) {
                      cardStyle = 'border-yellow-300 bg-yellow-50';
                    } else {
                      cardStyle = 'border-red-200 bg-red-50';
                    }
                  }
                  
                  return (
                    <div key={itemId} className={`border rounded-lg p-3 ${cardStyle}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{recipe.name}</h4>
                          <p className={`text-xs px-1 py-0.5 rounded inline-block mb-1 border ${getRarityColor(recipe.rarity)}`}>
                            {recipe.type} • {recipe.rarity}
                          </p>
                          <p className="text-xs text-gray-600">Stock: {count}</p>
                        </div>
                      </div>
                      
                      {selectedCustomer && saleInfo && (
                        <div className="mb-2">
                          <p className="text-xs font-bold">
                            {saleInfo.exactMatch ? (
                              <span className="text-green-600">✓ Perfect Match!</span>
                            ) : saleInfo.status === 'upgrade' ? (
                              <span className="text-blue-600">⬆️ Upgrade!</span>
                            ) : saleInfo.status === 'wrong_rarity' ? (
                              <span className="text-yellow-600">≈ Wrong rarity</span>
                            ) : selectedCustomer.isFlexible ? (
                              <span className="text-yellow-600">~ Acceptable substitute</span>
                            ) : (
                              <span className="text-red-600">~ Poor substitute</span>
                            )}
                          </p>
                          <p className="text-sm font-bold text-green-600">{saleInfo.payment}g</p>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => selectedCustomer && serveCustomer(selectedCustomer.id, itemId)}
                        disabled={!selectedCustomer}
                        className={`w-full py-2 rounded text-sm font-bold transition-colors ${
                          selectedCustomer 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {selectedCustomer ? `Sell to ${selectedCustomer.name}` : 'Select Customer First'}
                      </button>
                    </div>
                  );
                })}
                
                {filterInventoryByType(sellingTab).length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 italic">No {sellingTab}s in stock</p>
                    <p className="text-xs text-gray-400 mt-1">Craft some items to sell!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState.phase === PHASES.END_DAY && (
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Day {gameState.day} Complete!
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg text-center">
                <h3 className="font-bold text-green-800 text-sm">Today's Earnings</h3>
                <p className="text-lg font-bold text-green-600">
                  {gameState.customers.reduce((total, c) => total + (c.payment || 0), 0)} Gold
                </p>
              </div>
              
              <div className="bg-blue-100 p-3 rounded-lg text-center">
                <h3 className="font-bold text-blue-800 text-sm">Customers Served</h3>
                <p className="text-lg font-bold text-blue-600">
                  {gameState.customers.filter(c => c.satisfied).length} / {gameState.customers.length}
                </p>
              </div>
            </div>

            <button
              onClick={startNewDay}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold text-lg"
            >
              Start Day {gameState.day + 1}
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-yellow-600">
              <Coins className="w-4 h-4" />
              {gameState.gold}
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto">
              {getTopMaterials().map(([materialId, count]) => {
                const material = MATERIALS[materialId];
                return (
                  <div key={materialId} className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <span>{material.icon}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-gray-500">
              Day {gameState.day}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantsMorning;
