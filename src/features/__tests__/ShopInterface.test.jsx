import { render, screen } from '@testing-library/react';
import ShopInterface from '../ShopInterface';

const filterInventoryByType = () => [];
const sortByMatchQualityAndRarity = rs => rs;
const getSaleInfo = () => ({ canAfford: true, exactMatch: true });
const serveCustomer = () => {};

describe('ShopInterface', () => {
  test('shows waiting customers', () => {
    const gameState = {
      customers: [
        {
          id: 1,
          name: 'Sir Marcus',
          requestType: 'weapon',
          requestRarity: 'common',
          maxBudget: 100,
          satisfied: false,
        },
      ],
      inventory: {},
    };
    render(
      <ShopInterface
        gameState={gameState}
        selectedCustomer={null}
        setSelectedCustomer={() => {}}
        filterInventoryByType={filterInventoryByType}
        sortByMatchQualityAndRarity={sortByMatchQualityAndRarity}
        serveCustomer={serveCustomer}
        getSaleInfo={getSaleInfo}
      />
    );
    expect(screen.getByText(/Sir/i)).toBeInTheDocument();
  });
});
