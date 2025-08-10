import { render, screen } from '@testing-library/react';
import MaterialStallsPanel from '../MaterialStallsPanel';

describe('MaterialStallsPanel', () => {
  test('renders material chips', () => {
    const gameState = { materials: { wood: 2 } };
    render(<MaterialStallsPanel gameState={gameState} />);
    expect(screen.getByText(/wood/i)).toBeInTheDocument();
  });
});
