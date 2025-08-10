import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPE_ICONS } from '../constants';

function rarityClasses(rarity, dark) {
  const palettes = dark
    ? {
        common: 'from-gray-700 to-gray-600 border-gray-500',
        uncommon: 'from-green-700 to-green-600 border-green-500',
        rare: 'from-purple-700 to-purple-600 border-purple-500',
        legendary: 'from-amber-800 to-amber-600 border-amber-600',
      }
    : {
        common: 'from-gray-100 to-gray-200 border-gray-300',
        uncommon: 'from-green-100 to-green-200 border-green-300',
        rare: 'from-purple-100 to-purple-200 border-purple-300',
        legendary: 'from-amber-50 to-amber-100 border-amber-300',
      };
  return `bg-gradient-to-br ${palettes[rarity?.toLowerCase()] || palettes.common}`;
}

const InventoryItemCard = ({ recipe, count }) => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const totalValue = (recipe.sellPrice || 0) * count;

  return (
    <div
      className={`inventory-item-card ${rarityClasses(
        recipe.rarity,
        isDark
      )} text-gray-800 dark:text-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-transform transition-shadow duration-200`}
    >
      <div className="item-header">
        <div className="item-name">{recipe.name}</div>
        <div className={`rarity-badge rarity-${recipe.rarity}`}>
          {recipe.rarity}
        </div>
      </div>
      <div className="item-visual">
        <div className="item-icon">{ITEM_TYPE_ICONS[recipe.type]}</div>
        <div className="stack-indicator">×{count}</div>
      </div>
      <div className="item-value text-xs sm:text-sm flex justify-between">
        <span>{recipe.sellPrice}g each</span>
        <span className="font-medium">{totalValue}g</span>
      </div>
    </div>
  );
};

InventoryItemCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sellPrice: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
};

export default InventoryItemCard;
