import React from 'react';
import { render, screen } from '@testing-library/react';
import Notifications from '../Notifications.jsx';

describe('Notifications', () => {
  test('renders notifications with status role', () => {
    const notifications = [
      { id: 1, message: 'Hello', type: 'success' },
      { id: 2, message: 'Error', type: 'error' }
    ];
    render(<Notifications notifications={notifications} soundEnabled={false} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
