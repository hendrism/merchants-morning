import { render, screen } from '@testing-library/react';
import Workshop from '../Workshop';
import { RECIPES } from '../../constants';

const noop = () => {};
const canCraft = () => true;
const craftItem = () => {};
const filterRecipesByType = type => RECIPES.filter(r => r.type === type);
const sortRecipesByRarityAndCraftability = rs => rs;
const getRarityColor = () => '';

describe('Workshop', () => {
  test('collapsed shows craftable counts', () => {
    const gameState = { materials: {} };
    render(
      <Workshop
        gameState={gameState}
        craftingTab="weapon"
        setCraftingTab={noop}
        canCraft={canCraft}
        craftItem={craftItem}
        filterRecipesByType={filterRecipesByType}
        sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
        getRarityColor={getRarityColor}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Craftable:/i)).toBeInTheDocument();
  });

  test('semi-expanded shows categories', () => {
    const gameState = { materials: {} };
    render(
      <Workshop
        gameState={gameState}
        craftingTab="weapon"
        setCraftingTab={noop}
        canCraft={canCraft}
        craftItem={craftItem}
        filterRecipesByType={filterRecipesByType}
        sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
        getRarityColor={getRarityColor}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Weapon/i)).toBeInTheDocument();
  });

  test('expanded renders recipe list', () => {
    const gameState = { materials: {} };
    render(
      <Workshop
        gameState={gameState}
        craftingTab="weapon"
        setCraftingTab={noop}
        canCraft={canCraft}
        craftItem={craftItem}
        filterRecipesByType={filterRecipesByType}
        sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
        getRarityColor={getRarityColor}
        cardState={{ expanded: true, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Iron Dagger/i)).toBeInTheDocument();
  });
});
