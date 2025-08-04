import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EndOfDaySummary from '../EndOfDaySummary.jsx';

describe('EndOfDaySummary', () => {
  test('renders summary and starts new day', () => {
    const props = {
      gameState: {
        day: 1,
        customers: [
          { satisfied: true, payment: 10 },
          { satisfied: false, payment: 0 },
        ],
      },
      startNewDay: jest.fn(),
    };

    render(<EndOfDaySummary {...props} />);

    expect(screen.getByText('Day 1 Complete!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /start day 2/i }));
    expect(props.startNewDay).toHaveBeenCalled();
  });
});
