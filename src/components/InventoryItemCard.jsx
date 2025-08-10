import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPE_ICONS } from '../constants';

function rarityClasses(rarity, dark) {
  switch (rarity) {
    case 'Legendary':
      return dark
        ? 'from-amber-600 to-amber-800 text-amber-200 border-amber-700'
        : 'from-amber-100 to-amber-300 text-amber-700 border-amber-300';
    case 'Rare':
      return dark
        ? 'from-purple-700 to-purple-900 text-purple-200 border-purple-700'
        : 'from-purple-100 to-purple-300 text-purple-700 border-purple-300';
    case 'Uncommon':
      return dark
        ? 'from-green-700 to-green-900 text-green-200 border-green-700'
        : 'from-green-100 to-green-300 text-green-700 border-green-300';
    case 'Common':
    default:
      return dark
        ? 'from-gray-700 to-gray-800 text-gray-200 border-gray-600'
        : 'from-gray-100 to-gray-300 text-gray-700 border-gray-300';
  }
}

const InventoryItemCard = ({ recipe, count }) => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');
  const rarity =
    recipe.rarity.charAt(0).toUpperCase() + recipe.rarity.slice(1);
  const totalValue = recipe.sellPrice ? recipe.sellPrice * count : null;

  return (
    <div
      className={`inventory-item-card bg-gradient-to-br ${rarityClasses(
        rarity,
        isDark,
      )} border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform duration-200`}
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
      <div className="item-value">
        {recipe.sellPrice}g each
        {totalValue !== null && ` • ${totalValue}g total`}
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

export { rarityClasses };
export default InventoryItemCard;
