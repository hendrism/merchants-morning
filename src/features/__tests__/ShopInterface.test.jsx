import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopInterface from '../ShopInterface.jsx';

describe('ShopInterface', () => {
  test('selects customer and sells item', () => {
    const customer = {
      id: 'c1',
      name: 'Alice',
      profession: 'knight',
      requestType: 'weapon',
      requestRarity: 'common',
      offerPrice: 10,
      satisfied: false,
      isFlexible: false,
      budgetTier: 'middle',
      maxBudget: 20,
    };

    const props = {
      gameState: { customers: [customer], inventory: { iron_dagger: 1 } },
      selectedCustomer: null,
      setSelectedCustomer: jest.fn(),
      sellingTab: 'weapon',
      setSellingTab: jest.fn(),
      filterInventoryByType: jest.fn(() => [['iron_dagger', 1]]),
      sortByMatchQualityAndRarity: jest.fn(items => items),
      serveCustomer: jest.fn(),
      getRarityColor: jest.fn(() => 'border-gray-200'),
      getSaleInfo: jest.fn(() => ({ payment: 10, status: 'perfect', exactMatch: true, canAfford: true, isPreferred: false })),
    };

    const { rerender } = render(<ShopInterface {...props} />);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'c1' } });
    expect(props.setSelectedCustomer).toHaveBeenCalledWith(customer);
    expect(props.setSellingTab).toHaveBeenCalledWith('weapon');

    rerender(<ShopInterface {...props} selectedCustomer={customer} />);

    fireEvent.click(screen.getByText('Sell to Alice'));
    expect(props.serveCustomer).toHaveBeenCalledWith('c1', 'iron_dagger');
  });
});
