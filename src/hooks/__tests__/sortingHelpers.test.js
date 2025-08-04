import useCrafting from '../useCrafting';
import { RECIPES } from '../../constants';

describe('sorting helpers', () => {
  test('sortRecipesByRarityAndCraftability sorts correctly without mutating', () => {
    const gameState = {
      materials: { iron: 2, wood: 1 },
      inventory: {},
    };
    const setState = () => {};
    const { sortRecipesByRarityAndCraftability } = useCrafting(gameState, setState, jest.fn(), jest.fn());
    const recipes = [
      RECIPES.find(r => r.id === 'iron_sword'), // uncommon
      RECIPES.find(r => r.id === 'iron_dagger'), // common
    ];
    const original = [...recipes];

    const sorted = sortRecipesByRarityAndCraftability(recipes);

    expect(sorted[0].id).toBe('iron_dagger'); // craftable comes first
    expect(recipes).toEqual(original); // input not mutated
  });

  test('sortRecipesByRarityAndCraftability handles empty array', () => {
    const { sortRecipesByRarityAndCraftability } = useCrafting({ materials: {}, inventory: {} }, () => {}, jest.fn(), jest.fn());
    const recipes = [];
    const sorted = sortRecipesByRarityAndCraftability(recipes);
    expect(sorted).toEqual([]);
    expect(recipes).toEqual([]);
  });

  test('sortByMatchQualityAndRarity sorts by match quality without mutating', () => {
    const gameState = { inventory: { iron_dagger: 1, iron_sword: 1 }, materials: {} };
    const setState = () => {};
    const { sortByMatchQualityAndRarity } = useCrafting(gameState, setState, jest.fn(), jest.fn());
    const items = [ ['iron_sword', 1], ['iron_dagger', 1] ];
    const original = JSON.parse(JSON.stringify(items));
    const customer = { requestType: 'weapon', requestRarity: 'common', isFlexible: false };

    const sorted = sortByMatchQualityAndRarity(items, customer);

    expect(sorted[0][0]).toBe('iron_dagger'); // exact match first
    expect(items).toEqual(original); // input not mutated
  });

  test('sortByMatchQualityAndRarity handles empty inventory', () => {
    const gameState = { inventory: {}, materials: {} };
    const setState = () => {};
    const { sortByMatchQualityAndRarity } = useCrafting(gameState, setState, jest.fn(), jest.fn());
    const items = [];
    const sorted = sortByMatchQualityAndRarity(items, null);
    expect(sorted).toEqual([]);
    expect(items).toEqual([]);
  });
});
