import React from 'react';
import { render, screen } from '@testing-library/react';
import InventoryPanel from '../InventoryPanel';

const baseProps = {
  gameState: { inventory: {} },
  inventoryTab: 'weapon',
  setInventoryTab: jest.fn(),
  filterInventoryByType: () => [],
  toggleCategory: jest.fn(),
};

describe('InventoryPanel', () => {
  test('collapsed state shows summary', () => {
    render(
      <InventoryPanel
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/Inventory: 0 items/)).toBeInTheDocument();
  });

  test('semi-expanded with no inventory shows friendly message', () => {
    render(
      <InventoryPanel
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  test('expanded with no items shows crafted message', () => {
    render(
      <InventoryPanel
        {...baseProps}
        cardState={{ expanded: true, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/No weapons crafted yet/)).toBeInTheDocument();
  });
});

