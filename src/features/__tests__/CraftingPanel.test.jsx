import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CraftingPanel from '../CraftingPanel.jsx';

describe('CraftingPanel', () => {
  test('renders recipes and handles crafting', () => {
    const gameState = { materials: {}, inventory: {} };
    const recipe = { id: 'r1', name: 'Test Item', ingredients: {}, rarity: 'common' };

    const props = {
      gameState,
      craftingTab: 'weapon',
      setCraftingTab: jest.fn(),
      inventoryTab: 'weapon',
      setInventoryTab: jest.fn(),
      canCraft: jest.fn(() => true),
      craftItem: jest.fn(),
      filterRecipesByType: jest.fn(() => [recipe]),
      sortRecipesByRarityAndCraftability: jest.fn(recipes => recipes),
      filterInventoryByType: jest.fn(() => []),
      getRarityColor: jest.fn(() => 'border-gray-200'),
    };

    render(<CraftingPanel {...props} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✓ Craft'));
    expect(props.craftItem).toHaveBeenCalledWith('r1');

  });
});
