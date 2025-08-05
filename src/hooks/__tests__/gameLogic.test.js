import { renderHook } from '@testing-library/react';
import useCrafting from '../useCrafting';
import useCustomers from '../useCustomers';
import { setSeed } from '../../utils/random';
import { PHASES } from '../../constants';

describe('core game logic', () => {
  test('openBox charges gold and yields deterministic materials', () => {
    let state1 = { gold: 100, materials: {}, inventory: {}, phase: PHASES.MORNING };
    const setState1 = (fn) => { state1 = typeof fn === 'function' ? fn(state1) : fn; };
    const { result: result1 } = renderHook(() => useCrafting(state1, setState1, jest.fn(), jest.fn()));
    const { openBox } = result1.current;

    setSeed(123);
    openBox('bronze');

    expect(state1.gold).toBe(80);
    const materialsAfter = { ...state1.materials };

    let state2 = { gold: 100, materials: {}, inventory: {}, phase: PHASES.MORNING };
    const setState2 = (fn) => { state2 = typeof fn === 'function' ? fn(state2) : fn; };
    const { result: result2 } = renderHook(() => useCrafting(state2, setState2, jest.fn(), jest.fn()));
    const { openBox: openBox2 } = result2.current;

    setSeed(123);
    openBox2('bronze');

    expect(state2.gold).toBe(80);
    expect(state2.materials).toEqual(materialsAfter);
  });

  test('craftItem consumes materials and adds to inventory', () => {
    let state = { materials: { iron: 2, wood: 1 }, inventory: {}, gold: 0, phase: PHASES.CRAFTING };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { result } = renderHook(() => useCrafting(state, setState, jest.fn(), jest.fn()));
    const { craftItem } = result.current;

    craftItem('iron_dagger');

    expect(state.materials).toEqual({ iron: 1, wood: 0 });
    expect(state.inventory.iron_dagger).toBe(1);
  });

  test('craftItem does nothing if materials are insufficient', () => {
    let state = { materials: { iron: 1 }, inventory: {}, gold: 0, phase: PHASES.CRAFTING };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { result } = renderHook(() => useCrafting(state, setState, jest.fn(), jest.fn()));
    const { craftItem } = result.current;

    craftItem('iron_dagger');

    expect(state.materials).toEqual({ iron: 1 });
    expect(state.inventory).toEqual({});
  });

  test('startNewDay resets customers and increments day', () => {
    let state = { phase: PHASES.END_DAY, day: 1, customers: [{ id: '1' }], inventory: {}, gold: 0, totalEarnings: 0 };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const setSelectedCustomer = jest.fn();
    const { startNewDay } = useCustomers(state, setState, jest.fn(), jest.fn(), setSelectedCustomer);

    startNewDay();

    expect(state.day).toBe(2);
    expect(state.phase).toBe(PHASES.MORNING);
    expect(state.customers).toEqual([]);
    expect(setSelectedCustomer).toHaveBeenCalledWith(null);
  });

  test('openBox does not spend gold if insufficient funds', () => {
    let state = { gold: 10, materials: {}, inventory: {}, phase: PHASES.MORNING };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { result } = renderHook(() => useCrafting(state, setState, jest.fn(), jest.fn()));
    const { openBox } = result.current;

    openBox('bronze');

    expect(state.gold).toBe(10);
    expect(state.materials).toEqual({});
  });

  test('serveCustomer reduces inventory and adds gold', () => {
    let state = {
      inventory: { iron_dagger: 1 },
      gold: 0,
      customers: [
        {
          id: 'c1',
          name: 'Test',
          profession: 'merchant',
          requestType: 'weapon',
          requestRarity: 'common',
          offerPrice: 10,
          satisfied: false,
          isFlexible: false,
          budgetTier: 'middle',
          maxBudget: 20,
        },
      ],
      totalEarnings: 0,
      phase: PHASES.SHOPPING,
    };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { serveCustomer } = useCustomers(state, setState, jest.fn(), jest.fn(), jest.fn());

    serveCustomer('c1', 'iron_dagger');

    expect(state.inventory.iron_dagger).toBe(0);
    expect(state.gold).toBe(11);
    expect(state.customers[0].satisfied).toBe(true);
    expect(state.customers[0].payment).toBe(11);
  });

  test('serveCustomer rewards higher rarity upgrades', () => {
    let state = {
      inventory: { iron_sword: 1 },
      gold: 0,
      customers: [
        {
          id: 'c1',
          name: 'Test',
          profession: 'merchant',
          requestType: 'weapon',
          requestRarity: 'common',
          offerPrice: 100,
          satisfied: false,
          isFlexible: false,
          budgetTier: 'middle',
          maxBudget: 200,
        },
      ],
      totalEarnings: 0,
      phase: PHASES.SHOPPING,
    };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { serveCustomer } = useCustomers(state, setState, jest.fn(), jest.fn(), jest.fn());

    serveCustomer('c1', 'iron_sword');

    expect(state.gold).toBe(135);
    expect(state.customers[0].payment).toBe(135);
    expect(state.customers[0].satisfaction).toBe('delighted upgrade');
  });

  test('budget customers cannot afford expensive items', () => {
    let state = {
      inventory: { iron_sword: 1 },
      gold: 0,
      customers: [
        {
          id: 'c1',
          name: 'Budget Bob',
          profession: 'merchant',
          requestType: 'weapon',
          requestRarity: 'common',
          offerPrice: 15,
          satisfied: false,
          isFlexible: false,
          budgetTier: 'budget',
          maxBudget: 16,
        },
      ],
      totalEarnings: 0,
      phase: PHASES.SHOPPING,
    };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const addNotification = jest.fn();
    const { serveCustomer } = useCustomers(state, setState, jest.fn(), addNotification, jest.fn());

    serveCustomer('c1', 'iron_sword');

    expect(addNotification).toHaveBeenCalled();
    expect(state.inventory.iron_sword).toBe(1);
    expect(state.gold).toBe(0);
    expect(state.customers[0].satisfied).toBe(false);
  });
});
