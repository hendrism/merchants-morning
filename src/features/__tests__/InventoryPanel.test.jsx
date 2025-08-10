import { render, screen } from '@testing-library/react';
import InventoryPanel from '../InventoryPanel';
import { RECIPES } from '../../constants';

const noop = () => {};

const makeFilter = inventory => type =>
  Object.entries(inventory).filter(([itemId]) => {
    const recipe = RECIPES.find(r => r.id === itemId);
    return recipe?.type === type;
  });

describe('InventoryPanel', () => {
  test('collapsed shows total count', () => {
    const gameState = { inventory: { iron_dagger: 1 } };
    const filter = makeFilter(gameState.inventory);
    render(
      <InventoryPanel
        gameState={gameState}
        inventoryTab="weapon"
        setInventoryTab={noop}
        filterInventoryByType={filter}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Inventory:/i)).toBeInTheDocument();
  });

  test('semi-expanded with no items shows placeholder', () => {
    const gameState = { inventory: {} };
    const filter = makeFilter(gameState.inventory);
    render(
      <InventoryPanel
        gameState={gameState}
        inventoryTab="weapon"
        setInventoryTab={noop}
        filterInventoryByType={filter}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/No items yet/i)).toBeInTheDocument();
  });

  test('expanded renders inventory items', () => {
    const gameState = { inventory: { iron_dagger: 1 } };
    const filter = makeFilter(gameState.inventory);
    render(
      <InventoryPanel
        gameState={gameState}
        inventoryTab="weapon"
        setInventoryTab={noop}
        filterInventoryByType={filter}
        cardState={{ expanded: true, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Iron Dagger/i)).toBeInTheDocument();
  });
});
