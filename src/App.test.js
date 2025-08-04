import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders a placeholder title', () => {
  render(<div>Merchant's Morning</div>);
  expect(screen.getByText(/Merchant's Morning/i)).toBeInTheDocument();
});
