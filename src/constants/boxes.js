export const BOX_TYPES = {
  bronze: {
    name: 'Bronze Box',
    cost: 30,
    materialCount: [4, 5],
    rarityWeights: { common: 75, uncommon: 25, rare: 0 },
  },
  silver: {
    name: 'Silver Box',
    cost: 60,
    materialCount: [5, 7],
    rarityWeights: { common: 45, uncommon: 50, rare: 5 },
  },
  gold: {
    name: 'Gold Box',
    cost: 110,
    materialCount: [6, 8],
    rarityWeights: { common: 25, uncommon: 60, rare: 15 },
  },
  mythic: {
    name: 'Mythic Box',
    cost: 300,
    materialCount: [9, 13],
    rarityWeights: { common: 0, uncommon: 30, rare: 70 },
  },
};
