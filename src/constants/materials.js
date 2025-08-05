export const MATERIALS = {
  iron: { name: 'Iron', rarity: 'common', icon: '⚙️', type: 'metal' },
  wood: { name: 'Wood', rarity: 'common', icon: '🪵', type: 'wood' },
  fur: { name: 'Fur', rarity: 'common', icon: '🦫', type: 'beast' },
  cloth: { name: 'Cloth', rarity: 'common', icon: '🧵', type: 'fabric' },
  stone: { name: 'Stone', rarity: 'common', icon: '🪨', type: 'stone' },
  bone: { name: 'Bone', rarity: 'common', icon: '🦴', type: 'beast' },
  copper_ore: { name: 'Copper Ore', rarity: 'common', icon: '🥉', type: 'metal' },
  hemp: { name: 'Hemp', rarity: 'common', icon: '🌿', type: 'fabric' },
  coal: { name: 'Coal', rarity: 'common', icon: '🌑', type: 'stone' },

  leather: { name: 'Leather', rarity: 'uncommon', icon: '🪖', type: 'beast' },
  silver_ore: { name: 'Silver Ore', rarity: 'uncommon', icon: '🥈', type: 'metal' },
  silk: { name: 'Silk', rarity: 'uncommon', icon: '🕸️', type: 'fabric' },
  bronze: { name: 'Bronze', rarity: 'uncommon', icon: '🔶', type: 'metal' },

  gemstone: { name: 'Gemstone', rarity: 'rare', icon: '💎', type: 'gem' },
  gold_ore: { name: 'Gold Ore', rarity: 'rare', icon: '✨', type: 'metal' },
  crystal: { name: 'Crystal', rarity: 'rare', icon: '🔮', type: 'gem' },
  mithril: { name: 'Mithril', rarity: 'rare', icon: '⚡', type: 'metal' },
  ruby: { name: 'Ruby', rarity: 'rare', icon: '♦️', type: 'gem' },
  obsidian: { name: 'Obsidian', rarity: 'rare', icon: '⬛', type: 'stone' },
  jade: { name: 'Jade', rarity: 'rare', icon: '🟢', type: 'gem' },
  dragon_scale: { name: 'Dragon Scale', rarity: 'rare', icon: '🐲', type: 'beast' },
};

export const MATERIAL_VALUE_RANGE = {
  common: [3, 5],
  uncommon: [8, 12],
  rare: [15, 25],
};
