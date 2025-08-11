import { renderHook, act } from '@testing-library/react';
import useCardIntelligence from '../useCardIntelligence';

describe('useCardIntelligence', () => {
  test('category state persists within phase and resets on phase change', () => {
    const initial = { phase: 'morning', materials: {}, inventory: {}, craftableCount: 0 };
    const { result, rerender } = renderHook(({ gs }) => useCardIntelligence(gs), {
      initialProps: { gs: initial },
    });

    act(() => {
      result.current.toggleCategory('materials', 'wood');
    });
    expect(result.current.getCardState('materials').expandedCategories).toContain('wood');

    rerender({ gs: { ...initial, materials: { wood: 2 } } });
    expect(result.current.getCardState('materials').expandedCategories).toContain('wood');

    rerender({ gs: { ...initial, phase: 'crafting' } });
    expect(result.current.getCardState('materials').expandedCategories).not.toContain('wood');
  });
});
