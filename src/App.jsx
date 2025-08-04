import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showEventLog, setShowEventLog] = useState(false);
  const [craftingTab, setCraftingTab] = useState('weapon');
  const [inventoryTab, setInventoryTab] = useState('weapon');

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

  const startNewDay = () => {
    setGameState(prev => ({
      ...prev,
      phase: PHASES.MORNING,
      day: prev.day + 1,
      customers: []
    }));
    addEvent(`Started Day ${gameState.day + 1}`, 'info');
  };

  const canCraft = (recipe) => {
    return Object.entries(recipe.ingredients).every(([material, needed]) =>
      (gameState.materials[material] || 0) >= needed
    );
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
