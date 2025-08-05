import { random } from '../utils/random';

export const PROFESSIONS = {
  knight: {
    label: 'Knight',
    preferences: {
      weapon: ['sword'],
      armor: ['heavy'],
      trinket: ['ring'],
    },
    prefixes: ['Sir', 'Dame'],
    names: ['Marcus', 'Gareth', 'Sarah', 'Elena', 'Roland', 'Isolde'],
    epithets: ['the Knight', 'the Paladin', 'the Protector'],
  },
  ranger: {
    label: 'Ranger',
    preferences: {
      weapon: ['dagger'],
      armor: ['light'],
      trinket: ['amulet'],
    },
    prefixes: ['', ''],
    names: ['Elara', 'Marcus', 'Rin', 'Thorne', 'Sylvi', 'Kael'],
    epithets: ['the Scout', 'the Tracker'],
  },
  mage: {
    label: 'Mage',
    preferences: {
      weapon: ['staff'],
      armor: ['robe'],
      trinket: ['crown'],
    },
    prefixes: ['Wizard', 'Sorceress', 'Mage'],
    names: ['Thornwick', 'Luna', 'Eldrin', 'Mira', 'Zara'],
    epithets: ['', ''],
  },
  merchant: {
    label: 'Merchant',
    preferences: {
      weapon: [],
      armor: [],
      trinket: [],
    },
    prefixes: ['Trader', 'Merchant'],
    names: ['Willem', 'Chen', 'Rafi', 'Selim', 'Lucia'],
    epithets: [''],
  },
  noble: {
    label: 'Noble',
    preferences: {
      weapon: ['sword'],
      armor: ['heavy'],
      trinket: ['crown', 'ring'],
    },
    prefixes: ['Lord', 'Lady'],
    names: ['Benedict', 'Violette', 'Edmund', 'Helena'],
    epithets: ['', 'the Magnificent'],
  },
  guard: {
    label: 'Guard',
    preferences: {
      weapon: ['spear', 'axe', 'club'],
      armor: ['light'],
      trinket: ['ring'],
    },
    prefixes: ['Guard', 'Sergeant', 'Captain'],
    names: ['Torres', 'Mills', 'Harper', 'Dunn'],
    epithets: [''],
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
