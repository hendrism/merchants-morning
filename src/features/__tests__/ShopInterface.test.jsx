import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopInterface from '../ShopInterface.jsx';

const recipeId = 'iron_dagger';

describe('ShopInterface', () => {
  test('sells items to selected customer and ends day', () => {
    const customer = {
      id: 'c1',
      name: 'Bob',
      requestType: 'weapon',
      requestRarity: 'common',
      offerPrice: 10,
      satisfied: false,
      isFlexible: false,
    };

    const props = {
      gameState: { customers: [customer], inventory: { [recipeId]: 1 } },
      selectedCustomer: customer,
      setSelectedCustomer: jest.fn(),
      sellingTab: 'weapon',
      setSellingTab: jest.fn(),
      filterInventoryByType: jest.fn(() => [[recipeId, 1]]),
      sortByMatchQualityAndRarity: jest.fn(items => items),
      serveCustomer: jest.fn(),
      endDay: jest.fn(),
      getRarityColor: jest.fn(() => 'color'),
    };

    render(<ShopInterface {...props} />);

    fireEvent.click(screen.getByRole('button', { name: /sell to bob/i }));
    expect(props.serveCustomer).toHaveBeenCalledWith('c1', recipeId);

    fireEvent.click(screen.getByRole('button', { name: /close shop for today/i }));
    expect(props.endDay).toHaveBeenCalled();
  });
});
