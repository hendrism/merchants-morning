import React from 'react';
import { render, screen } from '@testing-library/react';
import EventLog from '../EventLog.jsx';

describe('EventLog', () => {
  test('renders placeholder when no events', () => {
    render(<EventLog events={[]} />);
    expect(screen.getByText(/No events yet/i)).toBeInTheDocument();
  });

  test('renders event entries', () => {
    const events = [
      { id: 1, message: 'Test event', type: 'info', timestamp: '10:00' }
    ];
    render(<EventLog events={events} />);
    expect(screen.getByText('Test event')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });
});
