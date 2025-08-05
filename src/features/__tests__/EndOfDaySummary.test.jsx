import React from 'react';
import { render, screen } from '@testing-library/react';
import EndOfDaySummary from '../EndOfDaySummary.jsx';

describe('EndOfDaySummary', () => {
  test('shows summary', () => {
    const gameState = {
      day: 1,
      customers: [
        { payment: 5, satisfied: true },
        { payment: 0, satisfied: false },
      ],
    };
    render(<EndOfDaySummary gameState={gameState} />);

    expect(screen.getByText('Day 1 Complete!')).toBeInTheDocument();
    expect(screen.getByText('5 Gold')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
