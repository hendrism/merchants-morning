import useCrafting from '../useCrafting';
import useCustomers from '../useCustomers';
import { setSeed } from '../../utils/random';
import { PHASES } from '../../constants';

describe('core game logic', () => {
  test('openBox charges gold and yields deterministic materials', () => {
    let state1 = { gold: 100, materials: {}, inventory: {}, phase: PHASES.MORNING };
    const setState1 = (fn) => { state1 = typeof fn === 'function' ? fn(state1) : fn; };
    const { openBox } = useCrafting(state1, setState1, jest.fn(), jest.fn());

    setSeed(123);
    openBox('bronze');

    expect(state1.gold).toBe(80);
    const materialsAfter = { ...state1.materials };

    let state2 = { gold: 100, materials: {}, inventory: {}, phase: PHASES.MORNING };
    const setState2 = (fn) => { state2 = typeof fn === 'function' ? fn(state2) : fn; };
    const { openBox: openBox2 } = useCrafting(state2, setState2, jest.fn(), jest.fn());

    setSeed(123);
    openBox2('bronze');

    expect(state2.gold).toBe(80);
    expect(state2.materials).toEqual(materialsAfter);
  });

  test('craftItem consumes materials and adds to inventory', () => {
    let state = { materials: { iron: 2, wood: 1 }, inventory: {}, gold: 0, phase: PHASES.CRAFTING };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { craftItem } = useCrafting(state, setState, jest.fn(), jest.fn());

    craftItem('iron_dagger');

    expect(state.materials).toEqual({ iron: 1, wood: 0 });
    expect(state.inventory.iron_dagger).toBe(1);
  });

  test('startNewDay resets customers and increments day', () => {
    let state = { phase: PHASES.END_DAY, day: 1, customers: [{ id: '1' }], inventory: {}, gold: 0, totalEarnings: 0 };
    const setState = (fn) => { state = typeof fn === 'function' ? fn(state) : fn; };
    const { startNewDay } = useCustomers(state, setState, jest.fn(), jest.fn(), jest.fn());

    startNewDay();

    expect(state.day).toBe(2);
    expect(state.phase).toBe(PHASES.MORNING);
    expect(state.customers).toEqual([]);
  });
});
