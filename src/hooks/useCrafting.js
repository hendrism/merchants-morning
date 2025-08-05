import { useCallback } from 'react';
import { MATERIALS, RECIPES, BOX_TYPES } from '../constants';
import { random } from '../utils/random';
import { compareRarities } from '../utils/rarity';

const useCrafting = (gameState, setGameState, addEvent, addNotification) => {
  const getRandomMaterial = (rarityWeights) => {
    const rand = random() * 100;
    let threshold = 0;
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      threshold += weight;
      if (rand <= threshold) {
        const materialsOfRarity = Object.entries(MATERIALS).filter(([, mat]) => mat.rarity === rarity);
        const randomMat = materialsOfRarity[Math.floor(random() * materialsOfRarity.length)];
        return randomMat[0];
      }
    }
    return 'iron';
  };

  const openBox = (boxType) => {
    const box = BOX_TYPES[boxType];
    let materialCount = 0;
    const foundMaterials = [];
    setGameState(prev => {
      if (prev.gold < box.cost) {
        addNotification('Not enough gold!', 'error');
        return prev;
      }
      materialCount = Math.floor(random() * (box.materialCount[1] - box.materialCount[0] + 1)) + box.materialCount[0];
      const newMaterials = { ...prev.materials };
      for (let i = 0; i < materialCount; i++) {
        const material = getRandomMaterial(box.rarityWeights);
        newMaterials[material] = (newMaterials[material] || 0) + 1;
        foundMaterials.push(MATERIALS[material].name);
      }
      return {
        ...prev,
        gold: prev.gold - box.cost,
        materials: newMaterials,
      };
    });
    if (materialCount > 0) {
      addEvent(`Opened ${box.name}: Found ${foundMaterials.join(', ')}`, 'success');
      addNotification(`📦 Opened ${box.name}! Found ${materialCount} materials`, 'success');
    }
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

  const canCraft = useCallback(
    (recipe) =>
      Object.entries(recipe.ingredients).every(([material, needed]) =>
        (gameState.materials[material] || 0) >= needed
      ),
    [gameState.materials]
  );

  const filterRecipesByType = useCallback(
    (type) => RECIPES.filter(recipe => recipe.type === type),
    []
  );

  const filterInventoryByType = useCallback(
    (type) =>
      Object.entries(gameState.inventory)
        .filter(([_, count]) => count > 0)
        .filter(([itemId]) => {
          const recipe = RECIPES.find(r => r.id === itemId);
          return recipe && recipe.type === type;
        }),
    [gameState.inventory]
  );

  const sortRecipesByRarityAndCraftability = useCallback(
    (recipes) =>
      [...recipes].sort((a, b) => {
        const canCraftA = canCraft(a);
        const canCraftB = canCraft(b);
        if (canCraftA && !canCraftB) return -1;
        if (!canCraftA && canCraftB) return 1;
        return compareRarities(b.rarity, a.rarity);
      }),
    [canCraft]
  );

  const sortByMatchQualityAndRarity = useCallback(
    (inventoryItems, customer) =>
      [...inventoryItems].sort((a, b) => {
        const recipeA = RECIPES.find(r => r.id === a[0]);
        const recipeB = RECIPES.find(r => r.id === b[0]);
        if (!customer) {
          return compareRarities(recipeB.rarity, recipeA.rarity);
        }
        const getMatchScore = (recipe) => {
          const exactMatch = recipe.type === customer.requestType && recipe.rarity === customer.requestRarity;
          if (exactMatch) return 4;
          if (compareRarities(recipe.rarity, customer.requestRarity) > 0 && recipe.type === customer.requestType) {
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
        return compareRarities(recipeB.rarity, recipeA.rarity);
      }),
    []
  );

  const getTopMaterials = () =>
    [...Object.entries(gameState.materials)]
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      // Show more materials so players get a clearer snapshot of their inventory
      .slice(0, 6);

  return {
    openBox,
    craftItem,
    canCraft,
    filterRecipesByType,
    filterInventoryByType,
    sortRecipesByRarityAndCraftability,
    sortByMatchQualityAndRarity,
    getTopMaterials,
  };
};

export default useCrafting;
