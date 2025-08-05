import { useState, useEffect } from 'react';
import { PHASES } from '../constants';
import useGamePersistence from './useGamePersistence';
import { generateMarketReports } from '../utils/marketReports';
const createInitialState = () => {
  const { reports, bias } = generateMarketReports();
  return {
    phase: PHASES.MORNING,
    day: 1,
    gold: 90,
    materials: {
      iron: 2,
      wood: 2,
      fur: 1,
      cloth: 1,
      stone: 1,
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
