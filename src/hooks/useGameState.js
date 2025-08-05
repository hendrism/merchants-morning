import { useState, useEffect } from 'react';
import { PHASES } from '../constants';
import useGamePersistence from './useGamePersistence';
import { generateMarketReports } from '../utils/marketReports';
const createInitialState = () => {
  const { reports, bias } = generateMarketReports();
  return {
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
    marketReports: reports,
    marketBias: bias,
  };
};

const INITIAL_GAME_STATE = createInitialState();

const useGameState = () => {
  const { loadState, saveState, clearState } = useGamePersistence('gameState');

  const [gameState, setGameState] = useState(() => loadState() || INITIAL_GAME_STATE);

  useEffect(() => {
    saveState(gameState);
  }, [gameState, saveState]);

  const resetGame = () => {
    setGameState(createInitialState());
    clearState();
  };

  return [gameState, setGameState, resetGame];
};

export default useGameState;
