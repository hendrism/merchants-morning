import { MATERIALS, MATERIAL_VALUE_RANGE } from './materials.js';

const MATERIAL_RARITY_MULTIPLIERS = { common: 1, uncommon: 1.5, rare: 2.5 };

const BASE_RECIPES = [
  {
    id: 'iron_dagger',
    name: 'Iron Dagger',
    ingredients: { iron: 1, wood: 1 },
    type: 'weapon',
    subcategory: 'dagger',
    rarity: 'common',
  },
  {
    id: 'wooden_club',
    name: 'Wooden Club',
    ingredients: { wood: 2, stone: 1 },
    type: 'weapon',
    subcategory: 'club',
    rarity: 'common',
  },
  {
    id: 'stone_axe',
    name: 'Stone Axe',
    ingredients: { stone: 2, wood: 1 },
    type: 'weapon',
    subcategory: 'axe',
    rarity: 'common',
  },
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    ingredients: { iron: 2, wood: 1, leather: 1 },
    type: 'weapon',
    subcategory: 'sword',
    rarity: 'uncommon',
  },
  {
    id: 'silver_blade',
    name: 'Silver Blade',
    ingredients: { silver_ore: 2, wood: 1 },
    type: 'weapon',
    subcategory: 'sword',
    rarity: 'uncommon',
  },
  {
    id: 'bronze_spear',
    name: 'Bronze Spear',
    ingredients: { bronze: 1, wood: 2 },
    type: 'weapon',
    subcategory: 'spear',
    rarity: 'uncommon',
  },
  {
    id: 'crystal_staff',
    name: 'Crystal Staff',
    ingredients: { wood: 1, crystal: 2 },
    type: 'weapon',
    subcategory: 'staff',
    rarity: 'rare',
  },
  {
    id: 'obsidian_blade',
    name: 'Obsidian Blade',
    ingredients: { obsidian: 2, mithril: 1 },
    type: 'weapon',
    subcategory: 'sword',
    rarity: 'rare',
  },
  {
    id: 'runed_sword',
    name: 'Runed Sword',
    ingredients: { mithril: 2, ruby: 1, silk: 1 },
    type: 'weapon',
    subcategory: 'sword',
    rarity: 'rare',
  },
  {
    id: 'cloth_robe',
    name: 'Cloth Robe',
    ingredients: { cloth: 3, fur: 1 },
    type: 'armor',
    subcategory: 'robe',
    rarity: 'common',
  },
  {
    id: 'wooden_shield',
    name: 'Wooden Shield',
    ingredients: { wood: 3 },
    type: 'armor',
    subcategory: 'light',
    rarity: 'common',
  },
  {
    id: 'fur_vest',
    name: 'Fur Vest',
    ingredients: { fur: 3, bone: 1 },
    type: 'armor',
    subcategory: 'light',
    rarity: 'common',
  },
  {
    id: 'leather_cap',
    name: 'Leather Cap',
    ingredients: { fur: 2, leather: 1 },
    type: 'armor',
    subcategory: 'light',
    rarity: 'uncommon',
  },
  {
    id: 'bronze_helmet',
    name: 'Bronze Helmet',
    ingredients: { bronze: 2, cloth: 1 },
    type: 'armor',
    subcategory: 'heavy',
    rarity: 'uncommon',
  },
  {
    id: 'silk_cloak',
    name: 'Silk Cloak',
    ingredients: { silk: 2, silver_ore: 1 },
    type: 'armor',
    subcategory: 'robe',
    rarity: 'uncommon',
  },
  {
    id: 'mithril_chainmail',
    name: 'Mithril Chainmail',
    ingredients: { mithril: 3, silk: 1 },
    type: 'armor',
    subcategory: 'heavy',
    rarity: 'rare',
  },
  {
    id: 'crystal_armor',
    name: 'Crystal Armor',
    ingredients: { crystal: 2, mithril: 2 },
    type: 'armor',
    subcategory: 'heavy',
    rarity: 'rare',
  },
  {
    id: 'golden_breastplate',
    name: 'Golden Breastplate',
    ingredients: { gold_ore: 3, gemstone: 1 },
    type: 'armor',
    subcategory: 'heavy',
    rarity: 'rare',
  },
  {
    id: 'bone_charm',
    name: 'Bone Charm',
    ingredients: { bone: 2, cloth: 1 },
    type: 'trinket',
    subcategory: 'charm',
    rarity: 'common',
  },
  {
    id: 'wooden_talisman',
    name: 'Wooden Talisman',
    ingredients: { wood: 2, stone: 1 },
    type: 'trinket',
    subcategory: 'talisman',
    rarity: 'common',
  },
  {
    id: 'iron_ring',
    name: 'Iron Ring',
    ingredients: { iron: 2, fur: 1 },
    type: 'trinket',
    subcategory: 'ring',
    rarity: 'common',
  },
  {
    id: 'silver_amulet',
    name: 'Silver Amulet',
    ingredients: { silver_ore: 2, silk: 1 },
    type: 'trinket',
    subcategory: 'amulet',
    rarity: 'uncommon',
  },
  {
    id: 'bronze_pendant',
    name: 'Bronze Pendant',
    ingredients: { bronze: 1, leather: 1, stone: 1 },
    type: 'trinket',
    subcategory: 'pendant',
    rarity: 'uncommon',
  },
  {
    id: 'enchanted_bracelet',
    name: 'Enchanted Bracelet',
    ingredients: { silver_ore: 1, bone: 2 },
    type: 'trinket',
    subcategory: 'bracelet',
    rarity: 'uncommon',
  },
  {
    id: 'gem_ring',
    name: 'Gem Ring',
    ingredients: { gold_ore: 1, gemstone: 1 },
    type: 'trinket',
    subcategory: 'ring',
    rarity: 'rare',
  },
  {
    id: 'ruby_crown',
    name: 'Ruby Crown',
    ingredients: { gold_ore: 2, ruby: 2 },
    type: 'trinket',
    subcategory: 'crown',
    rarity: 'rare',
  },
  {
    id: 'crystal_orb',
    name: 'Crystal Orb',
    ingredients: { crystal: 2, mithril: 1, silk: 1 },
    type: 'trinket',
    subcategory: 'orb',
    rarity: 'rare',
  },
];

const calculateRecipePrice = (recipe) => {
  let total = 0;
  for (const [material, count] of Object.entries(recipe.ingredients)) {
    const rarity = MATERIALS[material]?.rarity || 'common';
    const [, max] = MATERIAL_VALUE_RANGE[rarity] || [0, 0];
    const multiplier = MATERIAL_RARITY_MULTIPLIERS[rarity] || 1;
    total += count * max * multiplier;
  }
  const rarityBonus = recipe.rarity === 'common' ? 1.25 : 1;
  return Math.round(total * rarityBonus);
};

export const RECIPES = BASE_RECIPES.map(r => ({ ...r, sellPrice: calculateRecipePrice(r) }));
