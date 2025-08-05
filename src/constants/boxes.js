export const BOX_TYPES = {
  bronze: { name: 'Bronze Box', cost: 30, materialCount: [4, 5], rarityWeights: { common: 75, uncommon: 25, rare: 0 } },
  silver: { name: 'Silver Box', cost: 60, materialCount: [5, 7], rarityWeights: { common: 45, uncommon: 45, rare: 10 } },
  gold: { name: 'Gold Box', cost: 110, materialCount: [6, 8], rarityWeights: { common: 25, uncommon: 55, rare: 20 } },
  platinum: { name: 'Platinum Box', cost: 140, materialCount: [7, 10], rarityWeights: { common: 15, uncommon: 50, rare: 35 } },
  diamond: { name: 'Diamond Box', cost: 200, materialCount: [8, 11], rarityWeights: { common: 10, uncommon: 45, rare: 45 } },
  mythic: { name: 'Mythic Box', cost: 300, materialCount: [9, 13], rarityWeights: { common: 0, uncommon: 30, rare: 70 } },
};
