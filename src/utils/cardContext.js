import { PHASES } from '../constants';

export const getDefaultCardStatesForPhase = (phase, gameState = {}) => {
  const states = {
    supplyBoxes: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    marketNews: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    materials: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    workshop: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    inventory: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    customerQueue: { expanded: false, semiExpanded: false, hidden: false, expandedCategories: [] },
    daySummary: { expanded: false, semiExpanded: false, hidden: true, expandedCategories: [] }
  };

  switch (phase) {
    case PHASES.MORNING: {
      // Market news should always be expanded if there are reports
      states.marketNews.expanded = true; // Always expand, will show empty state if no reports
      states.supplyBoxes.semiExpanded = true;
      states.materials.semiExpanded = true;
      states.workshop.hidden = true;
      states.inventory.hidden = true;
      states.customerQueue.hidden = true;
      break;
    }
    case PHASES.CRAFTING: {
      states.marketNews.expanded = true; // Keep expanded in crafting too
      states.supplyBoxes.hidden = true;
      states.materials.semiExpanded = true;
      states.workshop.semiExpanded = true;
      states.inventory.semiExpanded = true;
      states.customerQueue.hidden = true;
      break;
    }
    case PHASES.SHOPPING: {
      states.supplyBoxes.hidden = true;
      states.marketNews.hidden = true;
      states.materials.hidden = false;
      states.workshop.hidden = true;
      states.inventory.expanded = true;
      states.customerQueue.expanded = true;
      break;
    }
    case PHASES.END_DAY: {
      states.marketNews.expanded = true; // Show in end day for reference
      states.supplyBoxes.expanded = true; // Show for next day planning
      states.materials.hidden = true;
      states.workshop.hidden = true;
      states.inventory.hidden = true;
      states.customerQueue.hidden = true;
      states.daySummary.hidden = false;
      states.daySummary.expanded = true;
      break;
    }
    default:
      break;
  }

  return states;
};

export const getCardRelevanceScore = (cardType) => {
  const basePriority = {
    marketNews: 1,
    supplyBoxes: 2,
    materials: 3,
    workshop: 4,
    inventory: 5,
    customerQueue: 6,
    daySummary: 7
  };
  return basePriority[cardType] ?? 99;
};
