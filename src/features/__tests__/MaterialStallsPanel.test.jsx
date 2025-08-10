import { render, screen } from '@testing-library/react';
import MaterialStallsPanel from '../MaterialStallsPanel';

const noop = () => {};
const getRarityColor = () => '';

describe('MaterialStallsPanel', () => {
  test('collapsed renders total materials', () => {
    const gameState = { materials: { wood: 2 } };
    render(
      <MaterialStallsPanel
        gameState={gameState}
        getRarityColor={getRarityColor}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Materials:/i)).toBeInTheDocument();
  });

  test('semi-expanded with no materials shows placeholder', () => {
    const gameState = { materials: {} };
    render(
      <MaterialStallsPanel
        gameState={gameState}
        getRarityColor={getRarityColor}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/No items yet/i)).toBeInTheDocument();
  });

  test('expanded renders stall content', () => {
    const gameState = { materials: { iron: 1 } };
    render(
      <MaterialStallsPanel
        gameState={gameState}
        getRarityColor={getRarityColor}
        cardState={{ expanded: true, semiExpanded: false, categoriesOpen: {} }}
        toggleCategory={noop}
      />
    );
    expect(screen.getByText(/Blacksmith/i)).toBeInTheDocument();
  });
});
