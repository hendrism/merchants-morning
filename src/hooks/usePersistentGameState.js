import { useState, useEffect } from 'react';
import { PHASES } from '../constants';

const initialState = {
  phase: PHASES.MORNING,
  day: 1,
  gold: 120,
  materials: {
    iron: 3,
    wood: 3,
    fur: 2,
    cloth: 2,
    stone: 2,
    bone: 1,
  },
  inventory: {},
  customers: [],
  totalEarnings: 0,
  shopLevel: 1,
};

export default function usePersistentGameState() {
  const [gameState, setGameState] = useState(() => {
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = window.localStorage.getItem('gameState');
      return saved ? JSON.parse(saved) : initialState;
    } catch (e) {
      console.error('Failed to load game state', e);
      return initialState;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('gameState', JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }, [gameState]);

  const resetGame = () => {
    setGameState(initialState);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('gameState');
      } catch (e) {
        console.error('Failed to reset game state', e);
      }
    }
  };

  return { gameState, setGameState, resetGame };
}
