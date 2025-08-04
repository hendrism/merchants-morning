import React from 'react';
import { render, screen } from '@testing-library/react';
import Notifications from '../Notifications.jsx';

describe('Notifications', () => {
  test('renders notifications', () => {
    const notifications = [
      { id: 1, message: 'Hello', type: 'success' },
      { id: 2, message: 'Error', type: 'error' }
    ];
    render(<Notifications notifications={notifications} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
