import { PHASES, RECIPES, PROFESSIONS, generateProfessionName, MATERIALS } from '../constants';
import { random } from '../utils/random';
import { getRarityRank } from '../utils/rarity';
import { generateMarketReports } from '../utils/marketReports';
import { getMaterialValue } from '../utils/materialValue';

const useCustomers = (gameState, setGameState, addEvent, addNotification, setSelectedCustomer) => {
  const generateCustomers = () => {
    const customerCount = Math.floor(random() * 4) + 3;
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

    const pickRequestType = () => {
      const weights = {
        weapon: 1 + (gameState.marketBias?.weapon || 0),
        armor: 1 + (gameState.marketBias?.armor || 0),
        trinket: 1 + (gameState.marketBias?.trinket || 0),
        potion: 1 + (gameState.marketBias?.potion || 0),
        tool: 1 + (gameState.marketBias?.tool || 0),
      };
      const total =
        weights.weapon +
        weights.armor +
        weights.trinket +
        weights.potion +
        weights.tool;
      const roll = random() * total;
      if (roll < weights.weapon) return 'weapon';
      if (roll < weights.weapon + weights.armor) return 'armor';
      if (roll < weights.weapon + weights.armor + weights.trinket) return 'trinket';
      if (roll < weights.weapon + weights.armor + weights.trinket + weights.potion) return 'potion';
      return 'tool';
    };

    const getRandomRarity = (weights) => {
      if (gameState.marketBias?.rare) {
        weights.rare += gameState.marketBias.rare * 100;
      }
      const total = Object.values(weights).reduce((a, b) => a + b, 0);
      const rand = random() * total;
      let threshold = 0;
      for (const [rarity, weight] of Object.entries(weights)) {
        threshold += weight;
        if (rand <= threshold) return rarity;
      }
      return 'common';
    };

    const professionKeys = Object.keys(PROFESSIONS);

    for (let i = 0; i < customerCount; i++) {
      const professionKey = professionKeys[Math.floor(random() * professionKeys.length)];
      const rarityWeights = getRarityWeights(gameState.day);

      const requestType = pickRequestType();
      const requestRarity = getRandomRarity(rarityWeights);

      const roll = random();
      let budgetTier = roll < 0.2 ? 'wealthy' : roll < 0.85 ? 'middle' : 'budget';
      if (professionKey === 'noble') budgetTier = 'wealthy';
      if (professionKey === 'guard') budgetTier = 'budget';

      let basePrice = requestRarity === 'common' ? 15 : requestRarity === 'uncommon' ? 25 : 50;

      switch (budgetTier) {
        case 'wealthy':
          basePrice *= 2.5;
          break;
        case 'middle':
          basePrice *= 1.3;
          break;
        case 'budget':
          basePrice *= 0.6;
          break;
        default:
          break;
      }

      const offerPrice = Math.floor(basePrice * (0.9 + random() * 0.3));

      const professionMaterials = PROFESSIONS[professionKey].materials || Object.keys(MATERIALS);
      const materialCount = Math.floor(random() * 3) + 2;
      const materials = [];
      for (let j = 0; j < materialCount; j++) {
        const matId = professionMaterials[Math.floor(random() * professionMaterials.length)];
        materials.push({ id: matId, value: getMaterialValue(matId) });
      }

      customers.push({
        id: crypto.randomUUID(),
        name: generateProfessionName(professionKey),
        profession: professionKey,
        requestType,
        requestRarity,
        offerPrice,
        satisfied: false,
        patience: Math.floor(random() * 3) + 2,
        budgetTier,
        maxBudget: Math.floor(
          basePrice * (budgetTier === 'wealthy' ? 2.5 : budgetTier === 'budget' ? 1.1 : 1.5)
        ),
        materials,
      });
    }
    // Ensure at least one customer requests each biased item type
    const biasedTypes = ['weapon', 'armor', 'trinket', 'potion', 'tool'].filter(
      type => (gameState.marketBias?.[type] || 0) > 0
    );
    const available = customers.map((_, idx) => idx);
    biasedTypes.forEach(type => {
      if (!customers.some(c => c.requestType === type) && available.length) {
        const idx = available.splice(
          Math.floor(random() * available.length),
          1
        )[0];
        customers[idx].requestType = type;
      }
    });

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
    addNotification('🛒 Shop opened', 'info');
  };

  const serveCustomer = (customerId, itemId, action = 'sell') => {
    const customer = gameState.customers.find(c => c.id === customerId);
    const recipe = RECIPES.find(r => r.id === itemId);

    if (!customer || !recipe || (gameState.inventory[itemId] || 0) < 1) return;
    if (recipe.type !== customer.requestType) {
      addNotification(`${customer.name} isn't interested in that type of item!`, 'error');
      return;
    }

    let basePayment = customer.offerPrice;
    let finalPayment = basePayment;
    let satisfaction = 'perfect';

    const exactMatch =
      recipe.type === customer.requestType && recipe.rarity === customer.requestRarity;

    if (exactMatch) {
      finalPayment = Math.floor(basePayment * 1.1);
      satisfaction = 'perfect match';
    } else {
      const rarityUpgrade =
        getRarityRank(recipe.rarity) - getRarityRank(customer.requestRarity);

      if (rarityUpgrade > 0) {
        const upgradeBonus = 0.2 + rarityUpgrade * 0.15;
        finalPayment = Math.floor(basePayment * (1 + upgradeBonus));
        satisfaction = 'delighted upgrade';
      } else if (rarityUpgrade < 0) {
        const downgradePenalty = Math.abs(rarityUpgrade) * 0.3;
        finalPayment = Math.floor(basePayment * (1 - downgradePenalty));
        satisfaction = 'disappointed downgrade';
      }
    }

    const prefersSubcategory =
      recipe.type === customer.requestType &&
      (PROFESSIONS[customer.profession]?.preferences[recipe.type] || []).includes(
        recipe.subcategory
      );

    if (prefersSubcategory) {
      finalPayment = Math.floor(finalPayment * 1.15);
      if (exactMatch) satisfaction = 'perfect style match';
    }

    finalPayment = Math.max(finalPayment, Math.floor(basePayment * 0.4));

    if (action === 'sell') {
      if (finalPayment > customer.maxBudget) {
        if (customer.budgetTier === 'budget') {
          addNotification(`${customer.name} can't afford that expensive item!`, 'error');
          return;
        } else {
          finalPayment = customer.maxBudget;
          satisfaction = 'expensive but worth it';
        }
      }
    } else if (action === 'accept_lower' || action === 'barter') {
      finalPayment = customer.maxBudget;
      satisfaction = action === 'barter' ? 'barter trade' : 'accepted lower offer';
    }

    const newInventory = { ...gameState.inventory };
    newInventory[itemId] -= 1;

    const customerMaterials = customer.materials || [];
    let newMaterials = { ...gameState.materials };
    if (action === 'barter') {
      customerMaterials.forEach(m => {
        newMaterials[m.id] = (newMaterials[m.id] || 0) + 1;
      });
    }

    const newCustomers = gameState.customers.map(c =>
      c.id === customerId
        ? { ...c, satisfied: true, payment: finalPayment, satisfaction }
        : c
    );

    setGameState(prev => ({
      ...prev,
      inventory: newInventory,
      customers: newCustomers,
      materials: newMaterials,
      gold: prev.gold + finalPayment,
      totalEarnings: prev.totalEarnings + finalPayment,
    }));

    const matchText =
      satisfaction === 'perfect match'
        ? '(Perfect match!)'
        : satisfaction === 'perfect style match'
        ? '(Perfect style match!)'
        : `(${satisfaction})`;
    const matText =
      action === 'barter' && customerMaterials.length
        ? ` and materials (${customerMaterials
            .map(m => MATERIALS[m.id].name)
            .join(', ')})`
        : '';
    addEvent(
      `Sold ${recipe.name} to ${customer.name} for ${finalPayment} gold${matText} ${matchText}`,
      'success'
    );
    addNotification(
      `💰 Sold ${recipe.name} for ${finalPayment} gold${action === 'barter' ? ' + materials' : ''}!`,
      'success'
    );
    setSelectedCustomer(null);
  };

  const endDay = () => {
    setGameState(prev => ({
      ...prev,
      phase: PHASES.END_DAY
    }));
    addEvent('Shop closed for the day', 'info');
    addNotification('🏁 Shop closed for the day', 'info');
  };

  const startNewDay = () => {
    const { reports, bias } = generateMarketReports();
    setGameState(prev => ({
      ...prev,
      phase: PHASES.MORNING,
      day: prev.day + 1,
      customers: [],
      marketReports: reports,
      marketBias: bias,
    }));
    const nextDay = gameState.day + 1;
    addEvent(`Started Day ${nextDay}`, 'info');
    addNotification(`🌅 Started Day ${nextDay}`, 'info');
    setSelectedCustomer(null);
  };

  return { openShop, serveCustomer, endDay, startNewDay };
};

export default useCustomers;
