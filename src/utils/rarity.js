import { RARITY_ORDER } from '../constants';

export const getRarityRank = (rarity) => RARITY_ORDER[rarity] || 0;

export const compareRarities = (rarityA, rarityB) => getRarityRank(rarityA) - getRarityRank(rarityB);

