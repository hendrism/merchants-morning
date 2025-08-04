import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Notifications from '../Notifications.jsx';

describe('Notifications', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders notifications and live region', () => {
    const notifications = [
      { id: 1, message: 'Hello', type: 'success' },
      { id: 2, message: 'Error', type: 'error' }
    ];
    render(<Notifications notifications={notifications} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('toggles sound preference', () => {
    const notifications = [{ id: 1, message: 'Hello', type: 'success' }];
    render(<Notifications notifications={notifications} />);
    const button = screen.getByRole('button', { name: /mute sound/i });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /enable sound/i })).toBeInTheDocument();
    expect(window.localStorage.getItem('notificationSoundEnabled')).toBe('false');
  });
});
