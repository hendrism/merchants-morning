import { render, screen } from '@testing-library/react';
import InventoryPanel from '../InventoryPanel';

const filterInventoryByType = type =>
  type === 'weapon' ? [['iron_dagger', 2]] : [];

describe('InventoryPanel', () => {
  test('shows category summary', () => {
    const gameState = { inventory: { iron_dagger: 2 } };
    render(
      <InventoryPanel gameState={gameState} filterInventoryByType={filterInventoryByType} />
    );
    expect(screen.getByText(/Weapon/i)).toBeInTheDocument();
  });
});
