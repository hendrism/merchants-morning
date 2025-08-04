import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShopInterface from '../ShopInterface.jsx';

describe('ShopInterface', () => {
  test('selects customer and sells item', () => {
    const customer = {
      id: 'c1',
      name: 'Alice',
      requestType: 'weapon',
      requestRarity: 'common',
      offerPrice: 10,
      satisfied: false,
      isFlexible: false,
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
      endDay: jest.fn(),
      getRarityColor: jest.fn(() => 'border-gray-200'),
    };

    const { rerender } = render(<ShopInterface {...props} />);

    fireEvent.click(screen.getByText('Alice'));
    expect(props.setSelectedCustomer).toHaveBeenCalledWith(customer);
    expect(props.setSellingTab).toHaveBeenCalledWith('weapon');

    rerender(<ShopInterface {...props} selectedCustomer={customer} />);

    fireEvent.click(screen.getByText('Sell to Alice'));
    expect(props.serveCustomer).toHaveBeenCalledWith('c1', 'iron_dagger');

    fireEvent.click(screen.getByText('Close Shop for Today'));
    expect(props.endDay).toHaveBeenCalled();
  });
});
