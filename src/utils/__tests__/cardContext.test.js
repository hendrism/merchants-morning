import { getDefaultCardStatesForPhase } from '../cardContext';
import { PHASES } from '../../constants';

describe('card context defaults', () => {
  test('customer queue is visible in shopping phase', () => {
    const states = getDefaultCardStatesForPhase(PHASES.SHOPPING);
    expect(states.customerQueue.hidden).toBe(false);
    expect(states.customerQueue.expanded).toBe(true);
    expect(states.customerQueue.semiExpanded).toBe(false);
  });
});
