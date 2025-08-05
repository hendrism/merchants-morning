import React from 'react';
import { render, screen } from '@testing-library/react';
import TabButton from '../TabButton.jsx';

describe('TabButton', () => {
  test('shows count even when zero', () => {
    render(
      <TabButton active={false} onClick={() => {}} count={0}>
        Weapons
      </TabButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Weapons');
    expect(button).toHaveTextContent('0');
  });

  test('hides count when not provided', () => {
    render(
      <TabButton active={false} onClick={() => {}}>
        Armor
      </TabButton>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Armor');
    expect(button).not.toHaveTextContent(/\(/);
  });
});
