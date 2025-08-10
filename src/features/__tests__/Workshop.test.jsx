import { render, screen } from '@testing-library/react';
import Workshop from '../Workshop';
import { RECIPES } from '../../constants';

const canCraft = () => true;
const craftItem = () => {};
const filterRecipesByType = type => RECIPES.filter(r => r.type === type);
const sortRecipesByRarityAndCraftability = rs => rs;

describe('Workshop', () => {
  test('renders recipes for default tab', () => {
    const gameState = { materials: {} };
    render(
      <Workshop
        gameState={gameState}
        canCraft={canCraft}
        craftItem={craftItem}
        filterRecipesByType={filterRecipesByType}
        sortRecipesByRarityAndCraftability={sortRecipesByRarityAndCraftability}
      />
    );
    expect(screen.getByText(/iron dagger/i)).toBeInTheDocument();
  });
});
