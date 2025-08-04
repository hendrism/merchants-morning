import { MATERIALS, RECIPES, BOX_TYPES, RARITY_ORDER } from '../constants';

const useCrafting = (gameState, setGameState, addEvent, addNotification) => {
  const getRandomMaterial = (rarityWeights) => {
    const rand = Math.random() * 100;
    let threshold = 0;
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      threshold += weight;
      if (rand <= threshold) {
        const materialsOfRarity = Object.entries(MATERIALS).filter(([, mat]) => mat.rarity === rarity);
        const randomMat = materialsOfRarity[Math.floor(Math.random() * materialsOfRarity.length)];
        return randomMat[0];
      }
    }
    return 'iron';
  };

  const openBox = (boxType) => {
    const box = BOX_TYPES[boxType];
    if (gameState.gold < box.cost) {
      addNotification('Not enough gold!', 'error');
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

  const canCraft = (recipe) => (
    Object.entries(recipe.ingredients).every(([material, needed]) =>
      (gameState.materials[material] || 0) >= needed
    )
  );

  const filterRecipesByType = (type) => RECIPES.filter(recipe => recipe.type === type);

  const filterInventoryByType = (type) =>
    Object.entries(gameState.inventory)
      .filter(([_, count]) => count > 0)
      .filter(([itemId]) => {
        const recipe = RECIPES.find(r => r.id === itemId);
        return recipe && recipe.type === type;
      });

  const sortRecipesByRarityAndCraftability = (recipes) =>
    recipes.sort((a, b) => {
      const canCraftA = canCraft(a);
      const canCraftB = canCraft(b);
      if (canCraftA && !canCraftB) return -1;
      if (!canCraftA && canCraftB) return 1;
      return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
    });

  const sortByMatchQualityAndRarity = (inventoryItems, customer) =>
    inventoryItems.sort((a, b) => {
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

  const getTopMaterials = () =>
    Object.entries(gameState.materials)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

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
