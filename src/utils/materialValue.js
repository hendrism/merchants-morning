import { MATERIALS, MATERIAL_VALUE_RANGE } from '../constants';
import { random } from './random';

export const getMaterialValue = (materialKey) => {
  const rarity = MATERIALS[materialKey]?.rarity || 'common';
  const [min, max] = MATERIAL_VALUE_RANGE[rarity] || [0, 0];
  return Math.floor(min + random() * (max - min + 1));
};
