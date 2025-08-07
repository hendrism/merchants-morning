import { PHASES, BOX_TYPES } from '../constants';

// Determine default card states based on game phase and user prefs
export const getDefaultCardStatesForPhase = (phase, gameState = {}, userPrefs = {}) => {
  const states = {
    supplyBoxes: { expanded: false, hidden: false },
    marketNews: { expanded: false, hidden: false },
    materials: { expanded: false, hidden: false },
    workshop: { expanded: false, hidden: false },
    inventory: { expanded: false, hidden: false },
    customerQueue: { expanded: false, hidden: false },
    endOfDay: { expanded: false, hidden: false },
  };

  switch (phase) {
    case PHASES.MORNING:
      states.supplyBoxes.expanded = true;
      states.marketNews.expanded = (gameState.marketReports || []).length > 0;
      states.materials.expanded = false;
      states.workshop.expanded = false;
      states.inventory.expanded = false;
      states.customerQueue.hidden = true;
      break;
    case PHASES.CRAFTING:
      states.supplyBoxes.expanded = false;
      states.marketNews.expanded = false;
      states.materials.expanded = true;
      states.workshop.expanded = true;
      states.inventory.expanded = false;
      states.customerQueue.hidden = true;
      break;
    case PHASES.SHOPPING:
      states.supplyBoxes.hidden = true;
      states.marketNews.hidden = true;
      states.materials.expanded = false;
      states.workshop.hidden = true;
      states.inventory.expanded = true;
      states.customerQueue.expanded = true;
      break;
    case PHASES.END_DAY:
      Object.keys(states).forEach(k => { states[k].expanded = false; });
      break;
    default:
      break;
  }

  const exp = userPrefs?.preferredExpansions?.[phase] || [];
  exp.forEach(card => {
    if (states[card]) {
      states[card].expanded = true;
      states[card].hidden = false;
    }
  });

  const col = userPrefs?.preferredCollapsed?.[phase] || [];
  col.forEach(card => {
    if (states[card]) {
      states[card].expanded = false;
    }
  });

  return states;
};

// Determine if a card should auto-expand based on context
export const shouldAutoExpand = (cardType, gameState = {}, userActivity = {}) => {
  if (cardType === 'marketNews') {
    return (gameState.marketReports || []).length > 0;
  }
  if (cardType === 'materials') {
    return !!userActivity.newMaterialsReceived;
  }
  if (cardType === 'supplyBoxes') {
    const goldCost = BOX_TYPES?.gold?.cost || Infinity;
    return gameState.gold >= goldCost && !userActivity.hasSeenGoldBox;
  }
  if (cardType === 'workshop') {
    const current = userActivity.craftableRecipeCount || 0;
    const prev = userActivity.previousCraftableCount || 0;
    return current > prev;
  }
  return false;
};

// Calculate a relevance score used for ordering
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

  if (cardType === 'supplyBoxes' && gameState.gold >= (BOX_TYPES.platinum?.cost || Infinity)) {
    priority -= 2;
  }

  if (cardType === 'workshop' && (gameState.craftableCount || 0) > 5) {
    priority -= 1;
  }

  if (cardType === 'customerQueue' && gameState.hasVIPCustomers) {
    priority -= 3;
  }

  if (typeof gameState.isCardEmpty === 'function' && gameState.isCardEmpty(cardType)) {
    priority += 10;
  }

  return priority;
};

export default {
  getDefaultCardStatesForPhase,
  shouldAutoExpand,
  getCardRelevanceScore,
};

