import { useState, useEffect } from 'react';
import { PHASES } from '../constants';
import useGamePersistence from './useGamePersistence';

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
  const { loadState, saveState, clearState } = useGamePersistence('gameState');

  const [gameState, setGameState] = useState(() => loadState() || INITIAL_GAME_STATE);

  useEffect(() => {
    saveState(gameState);
  }, [gameState, saveState]);

  const resetGame = () => {
    setGameState(INITIAL_GAME_STATE);
    clearState();
  };

  return [gameState, setGameState, resetGame];
};

export default useGameState;
