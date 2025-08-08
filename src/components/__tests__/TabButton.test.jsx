import React from 'react';
import { render, screen } from '@testing-library/react';
import TabButton from '../TabButton.jsx';

describe('TabButton', () => {
  test('shows count even when zero', () => {
    render(
      <TabButton active={false} onClick={() => {}} count={0} aria-label="Weapons">
        ⚔️
      </TabButton>
    );
    const button = screen.getByRole('button', { name: 'Weapons' });
    expect(button).toHaveTextContent('⚔️');
    expect(button).toHaveTextContent('0');
  });

  test('hides count when not provided', () => {
    render(
      <TabButton active={false} onClick={() => {}} aria-label="Armor">
        🛡️
      </TabButton>
    );
    const button = screen.getByRole('button', { name: 'Armor' });
    expect(button).toHaveTextContent('🛡️');
    expect(button).not.toHaveTextContent('0');
  });
});
