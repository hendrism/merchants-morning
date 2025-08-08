import { useState, useEffect } from 'react';
import { PHASES } from '../constants';
import useGamePersistence from './useGamePersistence';
import { generateMarketReports } from '../utils/marketReports';
const createInitialState = () => {
  const { reports, bias } = generateMarketReports();
  return {
    phase: PHASES.MORNING,
    day: 1,
    gold: 100,
    materials: {
      iron: 4,
      wood: 4,
      cloth: 3,
      stone: 3,
      fur: 2,
      bone: 2,
      herbs: 2,
      glass_vial: 2,
      rope: 1,
      coal: 1,
    },
    inventory: {},
    customers: [],
    totalEarnings: 0,
    shopLevel: 1,
    marketReports: reports,
    marketBias: bias,
    newMaterialsReceived: false,
    newMaterialsCount: 0,
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
