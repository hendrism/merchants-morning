import { useCallback, useEffect, useState } from 'react';
import { getDefaultCardStatesForPhase } from '../utils/cardContext';
import { BOX_TYPES } from '../constants';
import { CardId, CardState } from '../types/ui';

const applyPhaseDefaults = (
  prev: Record<string, any>,
  phase: string
): Record<string, any> => {
  const defaults = getDefaultCardStatesForPhase(phase);
  const merged: Record<string, any> = {};
  Object.keys(defaults).forEach((key) => {
    merged[key] = { ...(prev[key] || {}), ...defaults[key] };
  });
  return merged;
};

const useCardIntelligence = (gameState: any) => {
  const [cardStates, setCardStates] = useState<Record<string, any>>(() =>
    getDefaultCardStatesForPhase(gameState.phase, gameState)
  );

  useEffect(() => {
    setCardStates((prev) => applyPhaseDefaults(prev, gameState.phase));
  }, [gameState.phase]);

  const getCardState = useCallback(
    (id: CardId): CardState =>
      (cardStates[id] || {
        expanded: false,
        semiExpanded: false,
        hidden: false,
        expandedCategories: [],
        categoriesOpen: {},
      }) as CardState,
    [cardStates]
  );

  const updateCardState = useCallback(
    (id: CardId, updates: Record<string, any>) => {
      setCardStates((prev) => ({
        ...prev,
        [id]: { ...(getCardState(id) as any), ...updates },
      }));
    },
    [getCardState]
  );

  const toggleCategory = useCallback(
    (cardId: CardId, category: string): void => {
      setCardStates((prev) => {
        const current =
          prev[cardId] || {
            expanded: false,
            semiExpanded: false,
            hidden: false,
            expandedCategories: [],
            categoriesOpen: {},
          };
        const setCat = new Set(current.expandedCategories || []);
        let isOpen;
        if (setCat.has(category)) {
          setCat.delete(category);
          isOpen = false;
        } else {
          setCat.add(category);
          isOpen = true;
        }
        return {
          ...prev,
          [cardId]: {
            ...current,
            expandedCategories: Array.from(setCat),
            categoriesOpen: { ...((current as any).categoriesOpen || {}), [category]: isOpen },
          },
        };
      });
    },
    []
  );

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
