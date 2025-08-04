import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CraftingPanel from '../CraftingPanel.jsx';
import { RECIPES } from '../../constants';

describe('CraftingPanel', () => {
  test('renders recipes, allows crafting and opening shop', () => {
    const recipe = RECIPES.find(r => r.id === 'iron_dagger');
    const props = {
      gameState: { materials: { iron: 1, wood: 1 }, inventory: { iron_dagger: 1 } },
      craftingTab: 'weapon',
      setCraftingTab: jest.fn(),
      inventoryTab: 'weapon',
      setInventoryTab: jest.fn(),
      canCraft: jest.fn(() => true),
      craftItem: jest.fn(),
      filterRecipesByType: jest.fn(() => [recipe]),
      sortRecipesByRarityAndCraftability: jest.fn(r => r),
      filterInventoryByType: jest.fn(() => [['iron_dagger', 1]]),
      openShop: jest.fn(),
      getRarityColor: jest.fn(() => 'color'),
    };

    render(<CraftingPanel {...props} />);

    fireEvent.click(screen.getByText('✓ Craft'));
    expect(props.craftItem).toHaveBeenCalledWith('iron_dagger');

    fireEvent.click(screen.getByRole('button', { name: /open shop/i }));
    expect(props.openShop).toHaveBeenCalled();
  });
});
