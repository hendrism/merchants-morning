import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MorningPhase from '../MorningPhase';

test('renders supply boxes and continues to crafting', () => {
  const gameState = { gold: 100, materials: { iron: 1 } };
  const openBox = jest.fn();
  const continueToCrafting = jest.fn();
  const getRarityColor = () => '';

  render(
    <MorningPhase
      gameState={gameState}
      openBox={openBox}
      continueToCrafting={continueToCrafting}
      getRarityColor={getRarityColor}
    />
  );

  expect(screen.getByText(/Supply Boxes/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Continue to Crafting/i));
  expect(continueToCrafting).toHaveBeenCalled();
});
