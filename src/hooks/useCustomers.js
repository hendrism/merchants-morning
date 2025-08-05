import { PHASES, RECIPES } from '../constants';
import { random } from '../utils/random';
import { getRarityRank } from '../utils/rarity';

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

    const getRandomRarity = (weights) => {
      const rand = random() * 100;
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

      const requestType = requests[Math.floor(random() * requests.length)];
      const requestRarity = getRandomRarity(rarityWeights);

      const budgetTier = random() < 0.2 ? 'wealthy' : random() < 0.7 ? 'middle' : 'budget';

      let basePrice = requestRarity === 'common' ? 15 : requestRarity === 'uncommon' ? 25 : 50;

      switch (budgetTier) {
        case 'wealthy':
          basePrice *= 1.8;
          break;
        case 'budget':
          basePrice *= 0.6;
          break;
        default:
          break;
      }

      const offerPrice = Math.floor(basePrice * (0.9 + random() * 0.3));

      const flexibility = random();
      const isFlexible = flexibility > 0.6;

      customers.push({
        id: crypto.randomUUID(),
        name: `Customer ${i + 1}`,
        requestType,
        requestRarity,
        offerPrice,
        satisfied: false,
        isFlexible,
        patience: Math.floor(random() * 3) + 2,
        budgetTier,
        maxBudget: Math.floor(
          basePrice * (budgetTier === 'wealthy' ? 2.5 : budgetTier === 'budget' ? 1.1 : 1.5)
        ),
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

      if (recipe.type !== customer.requestType) {
        finalPayment = Math.floor(finalPayment * 0.8);
        satisfaction = customer.isFlexible
          ? 'acceptable substitute'
          : 'reluctant purchase';
      }
    }

    finalPayment = Math.max(finalPayment, Math.floor(basePayment * 0.4));

    if (finalPayment > customer.maxBudget) {
      if (customer.budgetTier === 'budget') {
        addNotification(`${customer.name} can't afford that expensive item!`, 'error');
        return;
      } else {
        finalPayment = customer.maxBudget;
        satisfaction = 'expensive but worth it';
      }
    }

    const newInventory = { ...gameState.inventory };
    newInventory[itemId] -= 1;

    const newCustomers = gameState.customers.map(c =>
      c.id === customerId
        ? { ...c, satisfied: true, payment: finalPayment, satisfaction }
        : c
    );

    setGameState(prev => ({
      ...prev,
      inventory: newInventory,
      customers: newCustomers,
      gold: prev.gold + finalPayment,
      totalEarnings: prev.totalEarnings + finalPayment,
    }));

    const matchText = exactMatch ? '(Perfect match!)' : `(${satisfaction})`;
    addEvent(
      `Sold ${recipe.name} to ${customer.name} for ${finalPayment} gold ${matchText}`,
      'success'
    );
    addNotification(`💰 Sold ${recipe.name} for ${finalPayment} gold!`, 'success');
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

  return { openShop, serveCustomer, endDay, startNewDay };
};

export default useCustomers;
