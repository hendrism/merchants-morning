import { useCallback, useEffect, useState } from 'react';
import { getDefaultCardStatesForPhase } from '../utils/cardContext';
import { BOX_TYPES } from '../constants';

// Reset per-phase defaults while ensuring categoriesOpen is always defined
const applyPhaseDefaults = (prev, phase) => {
  const defaults = getDefaultCardStatesForPhase(phase);
  const merged = {};
  Object.keys(defaults).forEach(key => {
    merged[key] = {
      ...(prev[key] || {}),
      ...defaults[key],
      categoriesOpen: {},
    };
  });
  return merged;
};

const useCardIntelligence = (gameState) => {
  const [cardStates, setCardStates] = useState(() => {
    const initial = getDefaultCardStatesForPhase(gameState.phase, gameState);
    Object.keys(initial).forEach(key => {
      initial[key].categoriesOpen = {};
    });
    return initial;
  });

  useEffect(() => {
    setCardStates((prev) => applyPhaseDefaults(prev, gameState.phase));
  }, [gameState.phase]);

  const getCardState = useCallback(
    (id) =>
      cardStates[id] || {
        expanded: false,
        semiExpanded: false,
        hidden: false,
        expandedCategories: [],
        categoriesOpen: {},
      },
    [cardStates]
  );

  const updateCardState = useCallback(
    (id, updates) => {
      setCardStates((prev) => ({
        ...prev,
        [id]: { ...getCardState(id), ...updates },
      }));
    },
    [getCardState]
  );

  // Toggle a specific category within a card, initializing state if missing
  const toggleCategory = useCallback((cardId, category) => {
    setCardStates(prev => {
      const card = prev[cardId] || {
        expanded: false,
        semiExpanded: false,
        hidden: false,
        categoriesOpen: {},
      };
      const open = card.categoriesOpen?.[category] ?? false;
      return {
        ...prev,
        [cardId]: {
          ...card,
          categoriesOpen: { ...card.categoriesOpen, [category]: !open },
        },
      };
    });
  }, []);

  const getCardStatus = useCallback(
    (cardType, gs = gameState) => {
      switch (cardType) {
        case 'marketNews': {
          const count = (gs.marketReports || []).length;
          return {
            status: count > 0 ? 'updated' : 'locked',
            subtitle: '',
            badge: count,
          };
        }
        case 'supplyBoxes': {
          const affordable = Object.entries(BOX_TYPES).filter(
            ([, box]) => (gs.gold || 0) >= box.cost
          );
          return {
            status: affordable.length > 0 ? 'available' : 'locked',
            subtitle: '',
            badge: affordable.length,
          };
        }
        case 'materials': {
          const total = Object.values(gs.materials || {}).reduce(
            (s, c) => s + c,
            0
          );
          return {
            status: total > 0 ? 'available' : 'locked',
            subtitle: '',
            badge: total,
          };
        }
        case 'workshop': {
          const craftable = gs.craftableCount || 0;
          return {
            status: craftable > 0 ? 'available' : 'locked',
            subtitle: '',
            badge: craftable,
          };
        }
        case 'inventory': {
          const total = Object.values(gs.inventory || {}).reduce(
            (s, c) => s + c,
            0
          );
          return {
            status: total > 0 ? 'available' : 'locked',
            subtitle: '',
            badge: total,
          };
        }
        case 'customerQueue': {
          const waiting = (gs.customers || []).filter(
            (c) => !c.satisfied
          ).length;
          return {
            status: waiting > 0 ? 'updated' : 'locked',
            subtitle: '',
            badge: waiting,
          };
        }
        case 'daySummary': {
          return {
            status: 'updated',
            subtitle: '',
            badge: 0,
          };
        }
        default:
          return { status: 'available', subtitle: '', badge: 0 };
      }
    },
    [gameState]
  );

  return {
    getCardState,
    updateCardState,
    toggleCategory,
    getCardStatus,
  };
};

export default useCardIntelligence;
