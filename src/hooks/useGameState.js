import { useState, useEffect } from 'react';
import { PHASES } from '../constants';

const INITIAL_GAME_STATE = {
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

const useGameState = () => {
  const [gameState, setGameState] = useState(() => {
    if (typeof window === 'undefined') return INITIAL_GAME_STATE;
    try {
      const saved = window.localStorage.getItem('gameState');
      return saved ? JSON.parse(saved) : INITIAL_GAME_STATE;
    } catch (e) {
      console.error('Failed to load game state', e);
      return INITIAL_GAME_STATE;
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
    setGameState(INITIAL_GAME_STATE);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('gameState');
      } catch (e) {
        console.error('Failed to clear game state', e);
      }
    }
  };

  return [gameState, setGameState, resetGame];
};

export default useGameState;
