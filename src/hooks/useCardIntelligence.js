import { useCallback, useState, useEffect } from 'react';
import { getDefaultCardStatesForPhase, getCardRelevanceScore } from '../utils/cardContext';
import { BOX_TYPES } from '../constants';

// Hook to manage smart card behaviour
const useCardIntelligence = (gameState, userPreferences = {}, setGameState) => {
  const [cardStates, setCardStates] = useState(() =>
    getDefaultCardStatesForPhase(gameState.phase, gameState, userPreferences)
  );

  const getCardState = useCallback(
    (id) => cardStates[id] || { expanded: false, hidden: false },
    [cardStates]
  );

  const updateCardState = useCallback((id, updates) => {
    setCardStates((prev) => ({
      ...prev,
      [id]: { ...getCardState(id), ...updates, userModified: updates.userModified ?? true },
    }));
  }, [getCardState]);

  // Auto-update card states when phase changes
  useEffect(() => {
      const newStates = getDefaultCardStatesForPhase(gameState.phase, gameState, userPreferences);
      setCardStates(prev => {
        // Merge with existing states, prioritizing context-aware defaults
        const merged = { ...prev };
        Object.entries(newStates).forEach(([cardId, newState]) => {
          // Only override if the card isn't manually set by user
          const userOverride = userPreferences.preferredExpansions?.[gameState.phase]?.includes(cardId);
          if (!userOverride) {
            merged[cardId] = { ...merged[cardId], ...newState };
          }
        });
        return merged;
      });
    }, [gameState, userPreferences]);

  // Auto-expand based on game events
  useEffect(() => {
    if (gameState.newMaterialsReceived) {
      updateCardState('materials', { expanded: true, userModified: false });

      const timer = setTimeout(() => {
        setCardStates(current => {
          const materialsState = current.materials || {};
          if (materialsState.expanded && !materialsState.userModified) {
            return {
              ...current,
              materials: { ...materialsState, expanded: false, userModified: false }
            };
          }
          return current;
        });

        if (setGameState) {
          setGameState(prev => ({
            ...prev,
            newMaterialsReceived: false,
            newMaterialsCount: 0,
          }));
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
    }, [gameState, setGameState, updateCardState]);

  // Auto-expand when customer VIPs arrive
  useEffect(() => {
    const vipCustomers = (gameState.customers || []).filter(c => c.budgetTier === 'wealthy');
    if (vipCustomers.length > 0 && gameState.phase === 'shopping') {
      updateCardState('customerQueue', { expanded: true, userModified: false });
    }
    }, [gameState, updateCardState]);

  const [, setUsage] = useState({});

  const getCardPriority = useCallback(
    (cardType, gs = gameState, userActivity = {}) =>
      getCardRelevanceScore(cardType, { ...gs, ...userActivity }),
    [gameState]
  );

  const addToPreferredExpansions = useCallback((phase, cardId) => {
    if (!userPreferences.preferredExpansions) {
      userPreferences.preferredExpansions = {};
    }
    const list = new Set(userPreferences.preferredExpansions[phase] || []);
    list.add(cardId);
    userPreferences.preferredExpansions[phase] = Array.from(list);
  }, [userPreferences]);

  const storeUsage = (data) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('cardUsage', JSON.stringify(data));
    } catch {
      /* noop */
    }
  };

  const trackCardUsage = useCallback((cardId, action) => {
    setUsage((prev) => {
      const usageData = { ...prev };
      const cardUsage = usageData[cardId] || { expansions: 0, lastUsed: null };
      if (action === 'expand') {
        cardUsage.expansions += 1;
        cardUsage.lastUsed = Date.now();
        if (cardUsage.expansions > 5) {
          addToPreferredExpansions(gameState.phase, cardId);
        }
      }
      usageData[cardId] = cardUsage;
      storeUsage(usageData);
      return usageData;
    });
  }, [addToPreferredExpansions, gameState.phase]);

  const getCardStatus = useCallback((cardType, gs = gameState) => {
    switch (cardType) {
      case 'marketNews': {
        const count = (gs.marketReports || []).length;
        return {
          subtitle: count > 0 ? `${count} report${count !== 1 ? 's' : ''}` : 'No reports today',
          status: count > 0 ? 'updated' : 'locked',
          badge: count,
        };
      }
      case 'supplyBoxes': {
        const affordable = Object.entries(BOX_TYPES).filter(([, box]) => (gs.gold || 0) >= box.cost);
        return {
          subtitle: affordable.length > 0
            ? `${affordable[0][1].name} available`
            : `Need ${BOX_TYPES.bronze.cost - (gs.gold || 0)}g more`,
          status: affordable.length > 0 ? 'available' : 'locked',
          badge: affordable.length,
        };
      }
      case 'materials': {
        const total = Object.values(gs.materials || {}).reduce((s, c) => s + c, 0);
        const newMaterials = gs.newMaterialsCount || 0;
        return {
          subtitle: `${total} items${newMaterials > 0 ? ` • ${newMaterials} new` : ''}`,
          status: newMaterials > 0 ? 'updated' : 'normal',
          badge: total,
        };
      }
      case 'workshop': {
        const craftable = gs.craftableCount || 0;
        const totalRecipes = gs.totalRecipeCount || 0;
        return {
          subtitle: `${craftable}/${totalRecipes} craftable`,
          status: craftable > 0 ? 'ready' : 'waiting',
          badge: craftable,
        };
      }
      case 'inventory': {
        const total = Object.values(gs.inventory || {}).reduce((s, c) => s + c, 0);
        return {
          subtitle: `${total} items`,
          status: total > 0 ? 'normal' : 'locked',
          badge: total,
        };
      }
      case 'customerQueue': {
        const waiting = (gs.customers || []).filter(c => !c.satisfied);
        const vip = waiting.filter(c => c.budgetTier === 'wealthy');
        return {
          subtitle: `${waiting.length} waiting${vip.length > 0 ? ` • ${vip.length} VIP` : ''}`,
          status: vip.length > 0 ? 'vip' : 'normal',
          badge: waiting.length,
        };
      }
      default:
        return { subtitle: '', status: 'normal', badge: 0 };
    }
  }, [gameState]);

  return {
    getCardState,
    updateCardState,
    getCardPriority,
    trackCardUsage,
    getCardStatus,
  };
};

export default useCardIntelligence;

