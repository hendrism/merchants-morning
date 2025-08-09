import React from 'react';
import PropTypes from 'prop-types';
import { ITEM_TYPE_ICONS } from '../constants';

const InventoryItemCard = ({ recipe, count, getRarityColor }) => (
  <div className={`inventory-item-card ${getRarityColor(recipe.rarity)}`}>
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
    <div className="item-value">{recipe.sellPrice}g each</div>
  </div>
);

InventoryItemCard.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sellPrice: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  getRarityColor: PropTypes.func.isRequired,
};

export default InventoryItemCard;
