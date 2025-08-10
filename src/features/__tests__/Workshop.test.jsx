import React from 'react';
import { render, screen } from '@testing-library/react';
import Workshop from '../Workshop';

const baseProps = {
  gameState: { materials: {} },
  craftingTab: 'weapon',
  setCraftingTab: jest.fn(),
  canCraft: () => false,
  craftItem: jest.fn(),
  filterRecipesByType: () => [],
  sortRecipesByRarityAndCraftability: a => a,
  getRarityColor: () => '',
  toggleCategory: jest.fn(),
};

describe('Workshop', () => {
  test('collapsed state shows summary', () => {
    render(
      <Workshop
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/Craftable: 0/)).toBeInTheDocument();
  });

  test('semi-expanded with no recipes shows friendly message', () => {
    render(
      <Workshop
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  test('expanded renders recipe', () => {
    const recipe = { id: 'r1', name: 'Test Blade', rarity: 'common', ingredients: {} };
    render(
      <Workshop
        {...baseProps}
        canCraft={() => true}
        filterRecipesByType={() => [recipe]}
        cardState={{ expanded: true, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText('Test Blade')).toBeInTheDocument();
  });
});

