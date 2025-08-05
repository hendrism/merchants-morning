import { renderHook } from '@testing-library/react';
import useCrafting from '../useCrafting';
import { RECIPES } from '../../constants';
import { PHASES } from '../../constants';

describe('sorting helpers', () => {
  test('sortRecipesByRarityAndCraftability prioritizes craftable recipes and preserves input', () => {
    const state = { materials: { iron: 2, wood: 1 }, inventory: {}, phase: PHASES.CRAFTING };
    const { result: hookResult } = renderHook(() => useCrafting(state, () => {}, jest.fn(), jest.fn()));
    const { sortRecipesByRarityAndCraftability } = hookResult.current;
    const recipes = RECIPES.filter(r => ['iron_dagger', 'iron_sword'].includes(r.id));
    const copy = [...recipes];

    const sorted = sortRecipesByRarityAndCraftability(recipes);

    expect(sorted.map(r => r.id)).toEqual(['iron_dagger', 'iron_sword']);
    expect(recipes).toEqual(copy);
  });

  test('sortByMatchQualityAndRarity respects customer preferences and preserves input', () => {
    const state = { materials: {}, inventory: {}, phase: PHASES.SHOPPING };
    const { result: hookResult } = renderHook(() => useCrafting(state, () => {}, jest.fn(), jest.fn()));
    const { sortByMatchQualityAndRarity } = hookResult.current;
    const inventory = [ ['iron_dagger', 1], ['iron_sword', 1] ];
    const copy = [...inventory];

    const customer = { requestType: 'weapon', requestRarity: 'common', offerPrice: 0, profession: 'ranger' };

    const sorted = sortByMatchQualityAndRarity(inventory, customer);
    expect(sorted[0][0]).toBe('iron_dagger');
    expect(inventory).toEqual(copy);

    const sortedNoCustomer = sortByMatchQualityAndRarity(inventory, null);
    expect(sortedNoCustomer[0][0]).toBe('iron_sword');
  });
});
