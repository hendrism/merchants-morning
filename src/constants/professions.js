import { random } from '../utils/random';
import { MATERIALS } from './materials';

export const PROFESSIONS = {
  knight: {
    label: 'Knight',
    preferences: {
      weapon: ['sword'],
      armor: ['heavy'],
      trinket: ['ring'],
      potion: ['healing'],
      tool: ['crafting'],
    },
    prefixes: ['Sir', 'Dame'],
    names: ['Marcus', 'Gareth', 'Sarah', 'Elena', 'Roland', 'Isolde'],
    epithets: ['the Knight', 'the Paladin', 'the Protector'],
    materials: ['iron', 'bronze', 'silver_ore'],
  },
  ranger: {
    label: 'Ranger',
    preferences: {
      weapon: ['dagger'],
      armor: ['light'],
      trinket: ['amulet'],
      potion: ['utility', 'buff'],
      tool: ['adventure'],
    },
    prefixes: ['', ''],
    names: ['Elara', 'Marcus', 'Rin', 'Thorne', 'Sylvi', 'Kael'],
    epithets: ['the Scout', 'the Tracker'],
    materials: ['wood', 'leather', 'fur'],
  },
  mage: {
    label: 'Mage',
    preferences: {
      weapon: ['staff'],
      armor: ['robe'],
      trinket: ['crown'],
      potion: ['elixir'],
      tool: ['magical'],
    },
    prefixes: ['Wizard', 'Sorceress', 'Mage'],
    names: ['Thornwick', 'Luna', 'Eldrin', 'Mira', 'Zara'],
    epithets: ['', ''],
    materials: ['silk', 'crystal', 'gemstone'],
  },
  merchant: {
    label: 'Merchant',
    preferences: {
      weapon: [],
      armor: [],
      trinket: [],
      potion: ['buff'],
      tool: ['professional'],
    },
    prefixes: ['Trader', 'Merchant'],
    names: ['Willem', 'Chen', 'Rafi', 'Selim', 'Lucia'],
    epithets: [''],
    materials: Object.keys(MATERIALS),
  },
  noble: {
    label: 'Noble',
    preferences: {
      weapon: ['sword'],
      armor: ['heavy'],
      trinket: ['crown', 'ring'],
      potion: [],
      tool: [],
    },
    prefixes: ['Lord', 'Lady'],
    names: ['Benedict', 'Violette', 'Edmund', 'Helena'],
    epithets: ['', 'the Magnificent'],
    materials: ['gemstone', 'gold_ore', 'crystal', 'mithril', 'ruby', 'obsidian'],
  },
  guard: {
    label: 'Guard',
    preferences: {
      weapon: ['spear', 'axe', 'club'],
      armor: ['light'],
      trinket: ['ring'],
      potion: [],
      tool: [],
    },
    prefixes: ['Guard', 'Sergeant', 'Captain'],
    names: ['Torres', 'Mills', 'Harper', 'Dunn'],
    epithets: [''],
    materials: ['iron', 'wood', 'cloth', 'stone', 'bone'],
  },
};

export const generateProfessionName = (professionKey) => {
  const prof = PROFESSIONS[professionKey];
  if (!prof) return 'Customer';
  const prefix = prof.prefixes[Math.floor(random() * prof.prefixes.length)] || '';
  const name = prof.names[Math.floor(random() * prof.names.length)];
  const epithet = prof.epithets[Math.floor(random() * prof.epithets.length)] || '';
  return [prefix, name, epithet].filter(Boolean).join(' ');
};
