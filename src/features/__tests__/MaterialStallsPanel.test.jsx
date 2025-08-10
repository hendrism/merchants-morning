import React from 'react';
import { render, screen } from '@testing-library/react';
import MaterialStallsPanel from '../MaterialStallsPanel';

const baseProps = {
  gameState: { materials: {} },
  getRarityColor: jest.fn(),
  toggleCategory: jest.fn(),
};

describe('MaterialStallsPanel', () => {
  test('collapsed state shows summary', () => {
    render(
      <MaterialStallsPanel
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: false, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/Materials: 0 total/)).toBeInTheDocument();
  });

  test('semi-expanded with no materials shows friendly message', () => {
    render(
      <MaterialStallsPanel
        {...baseProps}
        cardState={{ expanded: false, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  test('expanded empty stall shows fallback', () => {
    render(
      <MaterialStallsPanel
        {...baseProps}
        cardState={{ expanded: true, semiExpanded: true, categoriesOpen: {} }}
      />
    );
    expect(screen.getByText(/No materials at/)).toBeInTheDocument();
  });
});

