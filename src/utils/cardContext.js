import { PHASES, BOX_TYPES } from '../constants';

export const getDefaultCardStatesForPhase = (phase, gameState = {}, userPrefs = {}) => {
  const states = {
    supplyBoxes: { expanded: false, hidden: false },
    marketNews: { expanded: false, hidden: false },
    materials: { expanded: false, hidden: false },
    workshop: { expanded: false, hidden: false },
    inventory: { expanded: false, hidden: false },
    customerQueue: { expanded: false, hidden: false },
  };

  // Base phase logic
  switch (phase) {
    case PHASES.MORNING: {
      states.supplyBoxes.expanded = true;
      states.marketNews.expanded = (gameState.marketReports || []).length > 0;
      states.customerQueue.hidden = true;

      // Smart logic: If player has lots of gold, expand materials to show what they have
      if ((gameState.gold || 0) > 200) {
        states.materials.expanded = true;
      }
      break;
    }
    case PHASES.CRAFTING: {
      states.supplyBoxes.expanded = false;
      states.marketNews.expanded = false;
      states.materials.expanded = true;
      states.workshop.expanded = true;
      states.customerQueue.hidden = true;

      // Smart logic: If inventory is getting full, show it
      const totalInventory = Object.values(gameState.inventory || {}).reduce((s, c) => s + c, 0);
      if (totalInventory > 5) {
        states.inventory.expanded = true;
      }
      break;
    }
    case PHASES.SHOPPING: {
      states.supplyBoxes.hidden = true;
      states.marketNews.hidden = true;
      states.workshop.hidden = true;
      states.inventory.expanded = true;
      states.customerQueue.expanded = true;

      // Smart logic: If materials are low, collapse materials card
      const totalMaterials = Object.values(gameState.materials || {}).reduce((s, c) => s + c, 0);
      if (totalMaterials < 5) {
        states.materials.expanded = false;
      }
      break;
    }
    case PHASES.END_DAY: {
      // Collapse everything except end of day summary
      Object.keys(states).forEach(k => {
        states[k].expanded = false;
        states[k].hidden = false; // Show all for review
      });
      break;
    }
    default:
      break;
  }

  // Apply user preferences (these override smart defaults)
  const preferredExpansions = userPrefs?.preferredExpansions?.[phase] || [];
  preferredExpansions.forEach(cardId => {
    if (states[cardId] && !states[cardId].hidden) {
      states[cardId].expanded = true;
    }
  });

  const preferredCollapsed = userPrefs?.preferredCollapsed?.[phase] || [];
  preferredCollapsed.forEach(cardId => {
    if (states[cardId]) {
      states[cardId].expanded = false;
    }
  });

  return states;
};

// Enhanced relevance scoring
export const getCardRelevanceScore = (cardType, gameState = {}) => {
  const basePriority = {
    marketNews: 1,
    supplyBoxes: 2,
    materials: 3,
    workshop: 4,
    inventory: 5,
    customerQueue: 6,
  };

  let priority = basePriority[cardType] ?? 99;

  // Phase-specific adjustments
  switch (gameState.phase) {
    case PHASES.MORNING:
      if (cardType === 'supplyBoxes') priority -= 2;
      if (cardType === 'marketNews' && (gameState.marketReports || []).length > 0) priority -= 1;
      break;
    case PHASES.CRAFTING:
      if (cardType === 'workshop') priority -= 2;
      if (cardType === 'materials') priority -= 1;
      break;
    case PHASES.SHOPPING:
      if (cardType === 'customerQueue') priority -= 2;
      if (cardType === 'inventory') priority -= 1;
      break;
    default:
      break;
  }

  // Content-based adjustments
  if (cardType === 'supplyBoxes' && (gameState.gold || 0) >= (BOX_TYPES.platinum?.cost || 140)) {
    priority -= 1; // High gold = more relevant
  }

  if (cardType === 'customerQueue') {
    const vipCount = (gameState.customers || []).filter(c => c.budgetTier === 'wealthy').length;
    if (vipCount > 0) priority -= 2;
  }

  return priority;
};

