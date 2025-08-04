import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EndOfDaySummary from '../EndOfDaySummary.jsx';

describe('EndOfDaySummary', () => {
  test('shows summary and starts new day', () => {
    const gameState = {
      day: 1,
      customers: [
        { payment: 5, satisfied: true },
        { payment: 0, satisfied: false },
      ],
    };
    const startNewDay = jest.fn();

    render(<EndOfDaySummary gameState={gameState} startNewDay={startNewDay} />);

    expect(screen.getByText('Day 1 Complete!')).toBeInTheDocument();
    expect(screen.getByText('5 Gold')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Start Day 2'));
    expect(startNewDay).toHaveBeenCalled();
  });
});
