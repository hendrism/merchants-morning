import { renderHook, act } from '@testing-library/react';
import useCardIntelligence from '../useCardIntelligence';
import { PHASES } from '../../constants';

describe('useCardIntelligence', () => {
  test('category state persists within phase and resets on phase change', () => {
    let state = { phase: PHASES.MORNING, materials: {}, inventory: {}, gold: 0 };
    const { result, rerender } = renderHook(({ gs }) => useCardIntelligence(gs), {
      initialProps: { gs: state },
    });

    act(() => {
      result.current.toggleCategory('materials', 'metal');
    });
    expect(result.current.getCardState('materials').categoriesOpen.metal).toBe(true);

    state = { ...state, gold: 5 };
    rerender({ gs: state });
    expect(result.current.getCardState('materials').categoriesOpen.metal).toBe(true);

    state = { ...state, phase: PHASES.CRAFTING };
    rerender({ gs: state });
    expect(result.current.getCardState('materials').categoriesOpen.metal).toBeUndefined();
  });
});

